
const SliderSkeleton = () => {

    return (
        <div className={`flex justify-center items-center relative gap-8  `}>
            <img
                className={`w-1/4 md:w-1/6 h-auto rounded-lg blur-[1px]`}
                src='/assets/loading.png'
                alt="Previous"
            />

            <img
                className={`w-1/2 md:w-1/3 h-auto rounded-2xl `}
                src='/assets/loading.png'
                alt="Main"
            />

            <img
                className={`w-1/4 md:w-1/6 h-auto rounded-lg`}
                src='/assets/loading.png'
                alt="Next"
            />
        </div>
    );

};

export default SliderSkeleton;
