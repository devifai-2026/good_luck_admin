import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import CoverOne from '../../images/cover/cover-01.png';
import img from '../../images/user/user-02.png'

const ViewProfile = () => {
    return (
        <div>
            <Breadcrumb pageName="Profile" />

            <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="relative z-20 h-35 md:h-65">
                    <img
                        src={CoverOne}
                        alt="profile cover"
                        className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
                    />
                </div>
                <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
                    <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
                        <div className="relative drop-shadow-2">
                            <img src={img} alt="profile" className="w-full h-full object-cover" />
                            <label
                                htmlFor="profile"
                                className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                            >
                                <svg
                                    className="fill-current"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638Z"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M7.00004 5.83329C6.03354 5.83329 5.25004 6.61679 5.25004 7.58329C5.25004 8.54979 6.03354 9.33329 7.00004 9.33329C7.96654 9.33329 8.75004 8.54979 8.75004 7.58329C8.75004 6.61679 7.96654 5.83329 7.00004 5.83329Z"
                                    />
                                </svg>
                                <input type="file" name="profile" id="profile" className="sr-only" />
                            </label>
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                            Name
                        </h3>
                        <p className="font-medium">Admin</p>

                        {/* Fixed Grid Layout */}
                        <div className="mx-auto mt-4.5 mb-5.5 grid max-w-94 grid-cols-1 sm:grid-cols-3 gap-4 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
                            <div className="flex flex-col items-center justify-center px-4 text-center border-r-2">
                                <span className="font-semibold text-black dark:text-white">
                                15 <span className="text-sm text-gray-500">Users</span>
                                </span>
                              
                            </div>
                            <div className="flex flex-col items-center justify-center px-4 text-center border-r-2">
                                <span className="font-semibold text-black dark:text-white whitespace-nowrap">
                                20 <span className="text-sm text-gray-500">Astrologers</span>
                                </span>
                               
                            </div>
                            <div className="flex flex-col items-center justify-center px-4 text-center">
                                <span className="font-semibold text-black dark:text-white whitespace-nowrap">
                                    5000 <span className="text-sm text-gray-500">Earnings</span>
                                </span>
                    
                            </div>
                        </div>

                        <div className="mx-auto max-w-180">
                            <h4 className="font-semibold text-black dark:text-white">
                                About Me
                            </h4>
                            <p className="mt-4.5">
                                I, Dip Achariya, oversee the app's operations, ensuring a seamless experience for users seeking guidance through astrology. Whether you're looking for daily horoscopes, compatibility readings, or expert consultations, Rudraganga offers accurate and reliable astrology services at your fingertips.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewProfile;
