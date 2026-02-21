import React from 'react';

export const CreateMemberBox: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const border = 'rounded-lg';
  const style = 'bg-sky-500 hover:bg-sky-400 text-gray-900';
  const align = 'flex justify-center items-center';

  return (
    <td>
      <div className="p-2 h-full">
        <button onClick={onClick} className={`h-full w-full p-2 ${style} ${border} ${align}`}>
          + Add Member
        </button>
      </div>
    </td>
  );
};
