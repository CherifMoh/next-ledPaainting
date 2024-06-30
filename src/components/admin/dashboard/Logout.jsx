'use client';

import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

function Logout() {
    const router = useRouter();

    const removeCookie = () => {
        Cookies.remove('access-token');
        Cookies.remove('user-email');
        router.refresh();
    };

    return (
        <div className='flex-grow flex justify-center pb-8 items-end'>
            <FontAwesomeIcon 
                icon={faArrowRightFromBracket}
                className='size-6 text-red-500 cursor-pointer'
                onClick={removeCookie}
            />
        </div>
    );
}

export default Logout;
