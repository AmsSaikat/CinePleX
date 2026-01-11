import React from 'react';

export default function Input({icon:Icon,field, register, errors, validations, ...props }) {
  return (
    <div className='relative mb-6'>
      <div className="mb-4 absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
       {Icon && (
        <div className="absolute inset-y-5 left-0 flex items-center pl-3 pointer-events-none">
          <Icon className="text-green-500 h-5 w-5" />
        </div>
      )}

      </div>
          <input
        {...register(field, validations)}
        {...props}
        className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 
        rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2
        focus:ring-green-500 text-white placeholder-gray-400 transition duration-200 "
      />
      {errors[field] && <p className="text-red-500">{errors[field].message}</p>}
    </div>
  );
}
