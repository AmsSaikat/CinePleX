import Squad from "../model/squadModel.js";
import {User} from "../model/userModel.js";

// Helper function to escape special regex characters (prevents ReDoS attacks)
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ============================================================================
// 1. CREATE SQUAD (Leader initialisation)
// ============================================================================
// @route   POST /api/squad/create
export const createSquad = async (req, res) => {
  try {
    const { name, tag, motto, maxMembers, isPrivate, minClearanceLevel } = req.body;
    const leaderId = req.userId

    if (!leaderId) {
      return res.status(401).json({ success: false, message: "Leader authentication required." });
    }

    if (!name || !tag) {
      return res.status(400).json({ success: false, message: "Squad name and callsign tag are required." });
    }

    // Check if user already leads an active squad
    const existingLeaderSquad = await Squad.findOne({ leader: leaderId, status: "ACTIVE" });
    if (existingLeaderSquad) {
      return res.status(400).json({
        success: false,
        message: "You already lead an active squad. Disband or step down before forming a new unit.",
      });
    }

    // Check if squad name or tag is taken
    const existingName = await Squad.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${escapeRegex(name)}$`, "i") } },
        { tag: { $regex: new RegExp(`^${escapeRegex(tag)}$`, "i") } }
      ]
    });

    if (existingName) {
      return res.status(400).json({ success: false, message: "Squad designation name or callsign tag is already registered." });
    }

    // Create Squad with Leader as first member
    const newSquad = new Squad({
      name,
      tag: tag.toUpperCase(),
      motto: motto || "Honor through execution.",
      leader: leaderId,
      maxMembers: maxMembers || 5,
      isPrivate: isPrivate || false,
      minClearanceLevel: minClearanceLevel || "LEVEL_1",
      members: [
        {
          user: leaderId,
          role: "LEADER",
        },
      ],
    });

    await newSquad.save();
    await newSquad.populate("members.user", "-password");

    return res.status(201).json({
      success: true,
      message: `Squad [${newSquad.tag}] ${newSquad.name} initialized successfully.`,
      squad: newSquad,
    });
  } catch (error) {
    console.error("Create Squad Error:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error while initializing squad." });
  }
};

// ============================================================================
// 2. SEARCH OPERATIVES (Tactical multi-field query)
// ============================================================================
// @route   POST /api/squad/search-operatives
export const searchOperatives = async (req, res) => {
  try {
    const { query, searchType } = req.body;

    if (!query || !query.trim()) {
      return res.status(200).json({ success: true, operatives: [] });
    }

    const searchTerm = query.trim();
    const searchRegex = new RegExp(escapeRegex(searchTerm), "i");

    let filter = {};

    // Build query filter based on searchType
    if (searchType === "uid") {
      filter = { uid: searchRegex };
    } else {
      // Default: Search across name, email, or role
      filter = {
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { role: searchRegex }
        ],
      };
    }

    // Find matching users & project safe non-sensitive fields
    const operatives = await User.find(filter)
      .select("name email uid role photo clearance status bio")
      .limit(15);

    return res.status(200).json({
      success: true,
      count: operatives.length,
      operatives,
    });
  } catch (error) {
    console.error("Search Operatives Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while querying personnel database.",
    });
  }
};

// ============================================================================
// 3. COMMISSION / ADD OPERATIVE TO SQUAD
// ============================================================================
// @route   POST /api/squad/add
export const addOperativeToSquad = async (req, res) => {
  try {
    const { uid } = req.body;
    const requesterId = req.userId

    if (!uid) {
      return res.status(400).json({ success: false, message: "Operative UID is required." });
    }

    // 1. Find requester's active squad
    const squad = await Squad.findOne({ leader: requesterId, status: "ACTIVE" });
    if (!squad) {
      return res.status(404).json({ success: false, message: "No active squad found under your command." });
    }

    // 2. Check squad capacity
    if (squad.members.length >= squad.maxMembers) {
      return res.status(400).json({
        success: false,
        message: `Squad capacity limit reached (${squad.maxMembers} max members). Upgrade capacity in settings.`,
      });
    }

    // 3. Find target operative
    const targetOperative = await User.findOne({ uid });
    if (!targetOperative) {
      return res.status(404).json({ success: false, message: "Target operative UID not found." });
    }

    // 4. Prevent duplicate member assignment
    const isAlreadyMember = squad.members.some(
      (m) => m.user.toString() === targetOperative._id.toString()
    );
    if (isAlreadyMember) {
      return res.status(400).json({ success: false, message: "Operative is already commissioned in your squad." });
    }

    // 5. Add operative to members array
    squad.members.push({
      user: targetOperative._id,
      role: "OPERATIVE",
    });

    await squad.save();
    await squad.populate("members.user", "-password");

    return res.status(200).json({
      success: true,
      message: `${targetOperative.name} successfully commissioned to squad.`,
      squad,
    });
  } catch (error) {
    console.error("Add to Squad Error:", error);
    return res.status(500).json({ success: false, message: "Server error commissioning operative." });
  }
};

// ============================================================================
// 4. GET MY SQUAD DETAILS
// ============================================================================
// @route   GET /api/squad/my-squad
export const getMySquad = async (req, res) => {
  try {
    const userId = req.userId

    const squad = await Squad.findOne({
      "members.user": userId,
      status: "ACTIVE",
    })
      .populate("leader", "name email photo uid clearance")
      .populate("members.user", "name email photo uid role clearance status bio");

    if (!squad) {
      return res.status(200).json({ success: true, hasSquad: false, squad: null });
    }

    return res.status(200).json({
      success: true,
      hasSquad: true,
      squad,
    });
  } catch (error) {
    console.error("Get My Squad Error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching squad profile." });
  }
};

// ============================================================================
// 5. UPDATE SQUAD SETTINGS (Leader Only)
// ============================================================================
// @route   PUT /api/squad/settings
export const updateSquadSettings = async (req, res) => {
  try {
    const { name, motto, maxMembers, isPrivate, minClearanceLevel } = req.body;
    const leaderId = req.userId

    const squad = await Squad.findOne({ leader: leaderId, status: "ACTIVE" });
    if (!squad) {
      return res.status(404).json({ success: false, message: "Active squad not found or unauthorized access." });
    }

    if (maxMembers && maxMembers < squad.members.length) {
      return res.status(400).json({
        success: false,
        message: `Cannot reduce max capacity below current active member count (${squad.members.length}).`,
      });
    }

    if (name) squad.name = name;
    if (motto) squad.motto = motto;
    if (maxMembers) squad.maxMembers = maxMembers;
    if (typeof isPrivate === "boolean") squad.isPrivate = isPrivate;
    if (minClearanceLevel) squad.minClearanceLevel = minClearanceLevel;

    await squad.save();
    await squad.populate("members.user", "-password");

    return res.status(200).json({
      success: true,
      message: "Squad parameters successfully reconfigured.",
      squad,
    });
  } catch (error) {
    console.error("Update Squad Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update squad parameters." });
  }
};

// ============================================================================
// 6. REMOVE / KICK MEMBER (Leader Only)
// ============================================================================
// @route   POST /api/squad/remove-member
export const removeMember = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const requesterId = req.userId

    const squad = await Squad.findOne({ leader: requesterId, status: "ACTIVE" });
    if (!squad) {
      return res.status(403).json({ success: false, message: "Only squad leaders can dismiss operatives." });
    }

    if (targetUserId === squad.leader.toString()) {
      return res.status(400).json({ success: false, message: "Leader cannot be kicked. Disband squad instead." });
    }

    squad.members = squad.members.filter((m) => m.user.toString() !== targetUserId);

    await squad.save();
    await squad.populate("members.user", "-password");

    return res.status(200).json({
      success: true,
      message: "Operative dismissed from unit.",
      squad,
    });
  } catch (error) {
    console.error("Remove Member Error:", error);
    return res.status(500).json({ success: false, message: "Server error dismissing operative." });
  }
};

// ============================================================================
// 7. LEAVE SQUAD (Operative Self-Leave)
// ============================================================================
// @route   POST /api/squad/leave
export const leaveSquad = async (req, res) => {
  try {
    const userId = req.userId

    const squad = await Squad.findOne({ "members.user": userId, status: "ACTIVE" });
    if (!squad) {
      return res.status(404).json({ success: false, message: "You are not currently in an active squad." });
    }

    if (squad.leader.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Squad leaders cannot leave their unit. Transfer leadership or disband squad.",
      });
    }

    squad.members = squad.members.filter((m) => m.user.toString() !== userId.toString());
    await squad.save();

    return res.status(200).json({
      success: true,
      message: "You have left the squad.",
    });
  } catch (error) {
    console.error("Leave Squad Error:", error);
    return res.status(500).json({ success: false, message: "Server error processing leave request." });
  }
};

// ============================================================================
// 8. DISBAND SQUAD (Leader Only)
// ============================================================================
// @route   DELETE /api/squad/disband
export const disbandSquad = async (req, res) => {
  try {
    const leaderId = req.userId

    const squad = await Squad.findOne({ leader: leaderId, status: "ACTIVE" });
    if (!squad) {
      return res.status(404).json({ success: false, message: "Active squad not found or non-authorized." });
    }

    squad.status = "DISBANDED";
    await squad.save();

    return res.status(200).json({
      success: true,
      message: `Squad [${squad.tag}] ${squad.name} has been officially disbanded.`,
    });
  } catch (error) {
    console.error("Disband Squad Error:", error);
    return res.status(500).json({ success: false, message: "Server error disbanding squad." });
  }
};