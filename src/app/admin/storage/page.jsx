'use client'

function Storage() {
    return (
        <main className='p-4'>
            <div
                className='w-full p-8 flex justify-evenly items-center'
            >
                <button className='text-3xl font-semibold rounded shadow-sm bg-green-400 px-12 py-8 border-2 border-black'>
                    أدخل
                </button>
                <button className='text-3xl font-semibold rounded shadow-sm bg-red-400 px-12 py-8 border-2 border-black'>
                    أخرج
                </button>

            </div>
        </main>
    )
}

export default Storage