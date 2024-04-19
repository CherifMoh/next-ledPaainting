
const ProductGSkeleton = () => {

  const PArray=[1,2,3,4,5,6,7,8]
  const TArray=[1,2,3,4]

  const skeletonElements = PArray.map(num=>(
    <div key={num} className="p-4 rounded">
      <div className="relative h-64 w-auto mb-4 flex justify-center items-center bg-gray-300 animate-pulse">
        <svg
              className="w-10 h-10 text-gray-200 dark:text-gray-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
        </svg>
      </div>
      <div className="card-info">
        <div className="h-4 bg-gray-300 rounded-full mb-4"></div>
        <div className="h-3 bg-gray-300 rounded-full mb-3"></div>
      </div>
    </div>
  ))

  const tagsElement = TArray.map(num=>(
    <div 
     key={num} 
     className="bg-gray-300 w-24 h-6 rounded-full animate-pulse"
    >

    </div>
  ))
  
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex gap-5 mb-12 mt-8 items-center">
          {tagsElement}
        </div>
        <div className="hidden lg:block">
          <input 
            id="search"
            type='search' 
            className='w-64 px-2 py-1 rounded-xl border-2 border-gray-500 no-focus-outline text-black bg-stone-200' 
            placeholder={`Search`}
          />
        </div>
      </div>
      <div className="grid lg:grid-cols-4 grid-cols-2 gap-8">
        {skeletonElements}
      </div>
    </div>
  );
};

export default ProductGSkeleton;