import React from 'react';
import { Breadcrumb } from './components/Breadcrumb';
import { Camera, Image, Save, User as UserIcon, Mail, Upload } from 'lucide-react';

const Settings = () => {
    return (
        <>
            <Breadcrumb pageName="Settings" />

            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                <div className="flex flex-col gap-9">

                    {/* <!-- Personal Information Form --> */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white flex items-center gap-2">
                                <UserIcon className="w-5 h-5" /> Personal Information
                            </h3>
                        </div>
                        <form action="#">
                            <div className="p-6.5">
                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Danish"
                                            defaultValue="Danish"
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        />
                                    </div>

                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Heil"
                                            defaultValue="Heil"
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder="danish.heil@amadeus.com"
                                            defaultValue="danish.heil@amadeus.com"
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        />
                                        <Mail className="absolute right-4 top-4 h-5 w-5 opacity-50" />
                                    </div>
                                </div>

                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Bio
                                    </label>
                                    <textarea
                                        rows={6}
                                        placeholder="Write your bio here..."
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        defaultValue="Senior Systems Administrator with over 7 years of experience..."
                                    ></textarea>
                                </div>

                                <button className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90 text-white gap-2">
                                    <Save className="w-5 h-5" />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="flex flex-col gap-9">
                    {/* <!-- Photo Upload Card --> */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white flex items-center gap-2">
                                <Image className="w-5 h-5" /> Your Photo
                            </h3>
                        </div>
                        <div className="p-6.5">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="h-14 w-14 rounded-full">
                                    <img src="https://i.pravatar.cc/300?img=11" alt="User" className="rounded-full overflow-hidden w-full h-full object-cover" />
                                </div>
                                <div>
                                    <span className="mb-1.5 text-black dark:text-white">
                                        Edit your photo
                                    </span>
                                    <span className="flex gap-2.5">
                                        <button className="text-sm hover:text-primary">Delete</button>
                                        <button className="text-sm hover:text-primary">Update</button>
                                    </span>
                                </div>
                            </div>

                            <div id="FileUpload" className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                                />
                                <div className="flex flex-col items-center justify-center space-y-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                                        <Upload className="w-5 h-5 text-primary" />
                                    </span>
                                    <p>
                                        <span className="text-primary">Click to upload</span> or
                                        drag and drop
                                    </p>
                                    <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                                    <p>(max, 800 X 800px)</p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4.5">
                                <button
                                    className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                    type="button"
                                >
                                    Cancel
                                </button>
                                <button
                                    className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90 text-white"
                                    type="submit"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Settings;
