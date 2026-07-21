"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import {
  FiSearch,
  FiUser,
  FiBriefcase,
  FiHeart,
  FiBell,
  FiMic,
  FiFileText,
  FiFolder,
  FiSettings,
  FiBookmark,
  FiArrowLeft,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiChevronRight,
} from 'react-icons/fi';
import { HiOutlineOfficeBuilding, HiOutlineAcademicCap } from 'react-icons/hi';

// Green color scheme based on image
const PRIMARY_COLOR = '#228B22'; // A rich forest green, close to the image

const navItems = [
  { name: 'My Profile', icon: FiUser },
  { name: 'Applied Jobs', icon: FiBriefcase },
  { name: 'Favorite Jobs', icon: FiHeart },
  { name: 'Job Alert', icon: FiBell },
  { name: 'AI interview', icon: FiMic },
  { name: 'Submit CV', icon: FiFileText },
  { name: 'Resumes', icon: FiFileText },
  { name: 'Project Submissions', icon: FiFolder },
  { name: 'My Applications', icon: FiFileText },
  { name: 'My Portfolio', icon: FiFileText },
  { name: 'Settings', icon: FiSettings },
  { name: 'Find Job', icon: FiSearch },
];

const jobData = {
  title: 'Senior UX Designer',
  company: 'Instagram',
  tags: ['Featured', 'Full Time'],
  website: 'https://instagram.com',
  phone: '(406) 555-0120',
  email: 'career@instagram.com',
  applyLink: '#',
  expireDate: 'June 30, 2021',
  description: [
    'Integer aliquet pretium consequat. Donec et sapien id leo accumsan pellentesque eget maximus tellus. Duis et est ac leo rhoncus tincidunt vitae vehicula augue. Donec in suscipit diam. Pellentesque quis justo sit amet arcu commodo sollicitudin. Integer finibus blandit condimentum. Vivamus sit amet ligula ullamcorper, pulvinar ante id, tristique erat. Quisque sit amet aliquam urna. Maecenas blandit felis id massa sodales finibus. Integer bibendum eu nulla eu sollicitudin. Sed lobortis diam tincidunt accumsan faucibus. Quisque blandit augue quis turpis auctor, dapibus euismod ante ultricies. Ut non felis lacinia turpis feugiat euismod at id magna. Sed ut orci arcu. Suspendisse sollicitudin faucibus aliquet.',
    'Nam dapibus consectetur erat in euismod. Cras urna augue, mollis venenatis augue sed, porttitor aliquet nibh. Sed tristique dictum elementum. Nulla imperdiet sit amet quam eget lobortis. Etiam in neque sit amet orci interdum tincidunt.',
  ],
  responsibilities: [
    'Quisque semper gravida est consectetur.',
    'Curabitur blandit lorem velit, vitae pretium leo placerat eget.',
    'Morbi mattis in ipsum ac tempus.',
    'Curabitur eu vehicula libero. Vestibulum sed purus ullamcorper, lobortis lectus nec.',
    'vulputate turpis. Quisque ante odio, iaculis a porttitor sit amet.',
    'lobortis vel lectus. Nulla at risus ut diam.',
    'commodo feugiat. Nullam laoreet, diam placerat dapibus tincidunt.',
    'odio metus posuere lorem, id condimentum erat velit nec neque.',
    'dui sodales ut. Curabitur tempus augue.',
  ],
  overview: [
    { icon: FiClock, label: 'JOB POSTED:', value: '14 June, 2021' },
    { icon: FiClock, label: 'JOB EXPIRE IN:', value: '14 July, 2021' },
    { icon: HiOutlineAcademicCap, label: 'EDUCATION:', value: 'Graduation' },
    { icon: FiDollarSign, label: 'SALERY:', value: '$50k-80k/month' },
    { icon: FiMapPin, label: 'LOCATION:', value: 'New York, USA' },
    { icon: HiOutlineOfficeBuilding, label: 'JOB TYPE:', value: 'Full Time' },
    { icon: FiBriefcase, label: 'EXPERIENCE:', value: '10-15 Years' },
  ],
  companyDetails: {
    description: 'Social networking service',
    founded: 'March 21, 2006',
    organization: 'Private Company',
    size: '120-300 Employers',
    phone: '(406) 555-0120',
    email: 'twitter@gmail.com', // Note: Data says Twitter, but company is Instagram. Keeping data faithful to image.
    website: 'https://twitter.com', // Same note.
  },
};

const FindJobPage: NextPage = () => {
  const [activeNavItem, setActiveNavItem] = useState('Find Job');

  return (
    <>
      <Head>
        <title>{jobData.title} | {jobData.company} Job Details | Career Portal</title>
      </Head>

      <div className="min-h-screen bg-blue-50 flex text-gray-700 font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Sidebar Navigation */}
        <aside className="w-72 p-6 flex flex-col space-y-8 bg-white shadow-sm">
          <button className="self-start flex items-center gap-3 px-5 py-2.5 rounded-full text-white text-sm font-semibold shadow-md hover:opacity-90 transition-opacity" style={{ backgroundColor: PRIMARY_COLOR }}>
            <FiArrowLeft size={18} />
            BACK
          </button>
          <nav className="flex-grow flex flex-col space-y-1">
            <h2 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Main Menu</h2>
            {navItems.map((item) => (
              <a
                key={item.name}
                href="#"
                onClick={() => setActiveNavItem(item.name)}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-colors group
                  ${activeNavItem === item.name
                    ? 'text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
                style={activeNavItem === item.name ? { backgroundColor: PRIMARY_COLOR } : {}}
              >
                <item.icon size={18} className={activeNavItem === item.name ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'} />
                {item.name}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-10 space-y-10">
          {/* Header / Search Bar */}
          <header className="bg-white p-4 rounded-full shadow-sm flex items-center gap-4">
            <FiSearch size={22} className="text-gray-400 ml-4" />
            <input
              type="text"
              placeholder="Job tittle, keyword, company"
              className="flex-grow bg-transparent text-sm focus:outline-none"
            />
            <div className="flex items-center gap-3 pr-3">
                <img src={`/Senior UX Designer.jpg`} alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-green-100" />
                <span className="font-medium text-sm">Felix</span>
            </div>
          </header>

          {/* Job Detail Card */}
          <section className="bg-white p-10 rounded-3xl shadow-sm space-y-10">
            {/* Top Section: Company Info & Actions */}
            <div className="flex items-start gap-8 border-b border-gray-100 pb-10">
              <img
                src={`https://logo.clearbit.com/${jobData.company.toLowerCase()}.com`}
                alt={`${jobData.company} Logo`}
                className="w-28 h-28 rounded-full border border-gray-100 p-1"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/9.x/initials/svg?seed=${jobData.company}`;
                }}
              />
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-gray-900">{jobData.title}</h1>
                  <div className="flex items-center gap-2 text-xs font-medium">
                    {jobData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-green-600 bg-green-50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <a href={jobData.website} target="_blank" rel="noopener noreferrer" className="hover:text-green-700" style={{ color: PRIMARY_COLOR }}>
                    {jobData.website}
                  </a>
                  <span>{jobData.phone}</span>
                  <span>{jobData.email}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                  <div className='flex items-center gap-2'>
                    <button className="p-3 rounded-xl border border-gray-200 text-gray-400 hover:border-green-600 hover:text-green-600 transition-colors">
                        <FiBookmark size={20} />
                    </button>
                    <a
                        href={jobData.applyLink}
                        className="flex items-center gap-3 px-8 py-3 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
                        style={{ backgroundColor: PRIMARY_COLOR }}
                    >
                        Apply Now <FiChevronRight size={18} />
                    </a>
                  </div>
                  <span className="text-xs text-gray-500">Job expire in: <span className='text-red-500'>{jobData.expireDate}</span></span>
              </div>
            </div>

            {/* Bottom Section: Description, Overview, Company */}
            <div className="grid grid-cols-3 gap-12">
              {/* Left Column: Description & Responsibilities */}
              <div className="col-span-2 space-y-10">
                <div className="space-y-5">
                  <h2 className="text-xl font-semibold text-gray-900">Job Description</h2>
                  {jobData.description.map((para, index) => (
                    <p key={index} className="text-sm text-gray-600 leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>

                <div className="space-y-5">
                  <h2 className="text-xl font-semibold text-gray-900">Responsibilities</h2>
                  <ul className="space-y-3 list-disc list-inside text-sm text-gray-600">
                    {jobData.responsibilities.map((resp, index) => (
                      <li key={index} className="pl-2">{resp}</li>
                    ))}
                  </ul>
                </div>
                
                {/* Share section */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                    <span className="text-sm font-medium">Share this job:</span>
                    <button className="px-6 py-2.5 rounded-lg text-white text-xs font-medium bg-blue-600 flex items-center gap-2"><FiFacebook size={16}/> Facebook</button>
                    <button className="px-6 py-2.5 rounded-lg text-white text-xs font-medium bg-sky-500 flex items-center gap-2"><FiTwitter size={16}/> Twitter</button>
                    <button className="px-6 py-2.5 rounded-lg text-white text-xs font-medium bg-red-600 flex items-center gap-2"><FiHeart size={16}/> Pinterest</button>
                </div>
              </div>

              {/* Right Column: Job Overview & Company Info */}
              <div className="col-span-1 space-y-10">
                {/* Job Overview */}
                <div className="border border-gray-100 p-8 rounded-2xl space-y-8">
                    <h2 className="text-lg font-semibold text-gray-900">Job Overview</h2>
                    <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                        {jobData.overview.map((item, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <item.icon size={24} style={{ color: PRIMARY_COLOR }} className="flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="block text-xs text-gray-400 font-medium uppercase">{item.label}</span>
                                    <span className="block text-sm font-semibold text-gray-700">{item.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Company Info Card */}
                <div className="border border-gray-100 p-8 rounded-2xl space-y-6">
                    <div className="flex items-start gap-4">
                         <img
                            src={`https://logo.clearbit.com/${jobData.company.toLowerCase()}.com`}
                            alt={`${jobData.company} Logo`}
                            className="w-16 h-16 rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://api.dicebear.com/9.x/initials/svg?seed=${jobData.company}`;
                            }}
                          />
                        <div className='space-y-1'>
                            <h3 className="text-base font-semibold text-gray-900">{jobData.company}</h3>
                            <p className="text-xs text-gray-500">{jobData.companyDetails.description}</p>
                        </div>
                    </div>
                    <dl className="text-sm space-y-4 border-t border-gray-100 pt-6">
                        <div className="flex justify-between"><dt className="text-gray-500">Founded in:</dt><dd className="font-semibold text-gray-700">{jobData.companyDetails.founded}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Organization type:</dt><dd className="font-semibold text-gray-700">{jobData.companyDetails.organization}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Company size:</dt><dd className="font-semibold text-gray-700">{jobData.companyDetails.size}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Phone:</dt><dd className="font-semibold text-gray-700">{jobData.companyDetails.phone}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Email:</dt><dd className="font-semibold text-gray-700">{jobData.companyDetails.email}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Website:</dt><dd className="font-semibold text-gray-700 truncate ml-2" title={jobData.companyDetails.website}><a href={jobData.companyDetails.website} className='hover:underline'>{jobData.companyDetails.website}</a></dd></div>
                    </dl>
                     <div className="flex items-center gap-3 justify-center pt-4 border-t border-gray-100">
                        {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin].map((Icon, idx) => (
                            <a key={idx} href="#" className="p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-green-700" style={{ transition: 'all 0.2s' }}>
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>

              </div>
            </div>
          </section>
          
          {/* Footer */}
          <footer className="text-center text-xs text-gray-400 py-8">
            Powered by TechCorp © 2023. All rights reserved.
          </footer>

        </main>
      </div>
    </>
  );
};

export default FindJobPage;