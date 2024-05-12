const SliderSkeleton = () => {

    const images = [

    ]


    return (
        <div className={`flex justify-center items-center relative gap-8  `}>
            <img
                className={`w-1/4 md:w-1/6 h-auto rounded-lg blur-[1px]`}
                src={images[0]}
                alt="Previous"
            />

            <img
                className={`w-1/2 md:w-1/3 h-auto rounded-2xl `}
                src={images[1]}
                alt="Main"
            />

            <img
                className={`w-1/4 md:w-1/6 h-auto rounded-lg`}
                src={images[2]}
                alt="Next"
            />
        </div>
    );

};

export default SliderSkeleton;
