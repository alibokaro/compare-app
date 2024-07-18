import React from 'react';

interface Differences {
  [key: string]: {
    file1?: string;
    file2?: string;
  };
}

interface Props {
  data: Differences;
}

const DifferencesTable: React.FC<Props> = ({ data }) => {
  return (
    <div className="overflow-x-auto mt-5">
        <h2 className='bg-blue-500 p-2 text-white'>Differences in files</h2>
        {Object.entries(data).length>0 ? (
      <table className="min-w-full bg-gray border border-gray-200">
        <thead className=''>
          <tr> 
            <th className="py-2 px-4 border text-start">File 1</th>
            <th className="py-2 px-4 border text-start">File 2</th>
          </tr>
        </thead>
        <tbody>
          {data && Object.entries(data).map(([id, { file1, file2 }]) => (
            <tr key={id}> 
              <td className="py-2 px-4 border">{file1 ? `${id}:${file1}` : `No Match found data start with ${id} in file1`}</td>
              <td className="py-2 px-4 border">{file2 ? `${id}:${file2}` :`No Match found data start with ${id} in file2`}</td>
            </tr>
          ))}
        </tbody>
      </table>
      ): <h3 className='bg-amber-300 w-[300px] text-center my-3 mx-auto px-10'>Files are idendical</h3>}
    </div>
  );
};
export default DifferencesTable;
