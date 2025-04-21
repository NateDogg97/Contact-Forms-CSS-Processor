// This file contains all Tailwind classes used in the components directory
// The comments below will be picked up by the Tailwind scanner

/*
// Layout & Positioning
fixed absolute relative sticky inset-0 inset-x-0 inset-y-0 top-0 bottom-0 left-0 right-0 end-[0px]
z-10 z-20 z-30 z-40 z-50 z-[9999]

// Flexbox & Grid
flex flex-row flex-col flex-wrap flex-nowrap flex-1 flex-auto flex-initial flex-grow flex-shrink
justify-start justify-end justify-center justify-between justify-around justify-evenly
items-start items-end items-center items-baseline items-stretch
self-auto self-start self-end self-center self-stretch self-baseline
grid grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4 grid-cols-5 grid-cols-12
col-span-1 col-span-2 col-span-3 col-span-4 col-span-5 col-span-6 col-span-12
gap-1 gap-2 gap-3 gap-4 gap-6 gap-8 gap-x-2 gap-y-3 gap-x-4 gap-y-4

// Width & Height
w-0 w-1 w-2 w-3 w-4 w-5 w-6 w-8 w-10 w-12 w-16 w-20 w-24 w-32 w-40 w-48 w-56 w-64 w-auto w-full w-screen
h-0 h-1 h-2 h-3 h-4 h-5 h-6 h-7 h-8 h-10 h-12 h-16 h-20 h-24 h-32 h-40 h-48 h-56 h-64 h-auto h-full h-screen
min-w-0 min-w-full min-h-0 min-h-full
max-w-xs max-w-sm max-w-md max-w-lg max-w-xl max-w-2xl max-w-full max-w-screen-sm max-w-screen-md
max-h-[90vh]

// Spacing (Padding & Margin)
p-0 p-1 p-2 p-3 p-4 p-5 p-6 p-8 p-10 p-12 px-1 px-2 px-3 px-4 px-6 px-8 py-0 py-1 py-2 py-3 py-4 py-6 py-8
pt-1 pt-2 pt-3 pt-4 pt-6 pt-8 pr-1 pr-2 pr-3 pr-4 pr-6 pr-8 pb-1 pb-2 pb-3 pb-4 pb-6 pb-8 pl-1 pl-2 pl-3 pl-4 pl-5 pl-6 pl-8
m-0 m-1 m-2 m-3 m-4 m-5 m-6 m-8 m-auto mx-1 mx-2 mx-3 mx-4 mx-auto my-1 my-2 my-3 my-4 my-6
mt-1 mt-2 mt-3 mt-4 mt-6 mr-1 mr-2 mr-3 mr-4 mb-1 mb-2 mb-3 mb-4 mb-6 ml-1 ml-2 ml-3 ml-4 ml-6
-m-1 -m-2 -m-4 -mx-1 -mx-2 -my-1 -my-2
space-x-1 space-x-2 space-x-3 space-x-4 space-y-1 space-y-2 space-y-3 space-y-4 space-y-6

// Typography
text-xs text-sm text-base text-lg text-xl text-2xl text-center text-left text-right text-justify
font-thin font-extralight font-light font-normal font-medium font-semibold font-bold font-extrabold
tracking-tighter tracking-tight tracking-normal tracking-wide tracking-wider
leading-3 leading-4 leading-5 leading-6 leading-7 leading-8 leading-9 leading-10 leading-none leading-tight leading-snug leading-normal leading-relaxed leading-loose
italic non-italic
underline no-underline line-through
uppercase lowercase capitalize normal-case
truncate overflow-ellipsis overflow-clip whitespace-normal whitespace-nowrap whitespace-pre whitespace-pre-line whitespace-pre-wrap break-normal break-words break-all
select-none select-text select-all select-auto

// Backgrounds
bg-transparent bg-current bg-black bg-white 
bg-gray-50 bg-gray-100 bg-gray-200 bg-gray-300 bg-gray-400 bg-gray-500 bg-gray-600 bg-gray-700 bg-gray-800 bg-gray-900
bg-red-50 bg-red-100 bg-red-200 bg-red-300 bg-red-400 bg-red-500 bg-red-600 bg-red-700 bg-red-800 bg-red-900
bg-orange-50 bg-orange-100 bg-orange-200 bg-orange-300 bg-orange-400 bg-orange-500 bg-orange-600 bg-orange-700 bg-orange-800 bg-orange-900
bg-yellow-50 bg-yellow-100 bg-yellow-200 bg-yellow-300 bg-yellow-400 bg-yellow-500 bg-yellow-600 bg-yellow-700 bg-yellow-800 bg-yellow-900
bg-green-50 bg-green-100 bg-green-200 bg-green-300 bg-green-400 bg-green-500 bg-green-600 bg-green-700 bg-green-800 bg-green-900
bg-blue-50 bg-blue-100 bg-blue-200 bg-blue-300 bg-blue-400 bg-blue-500 bg-blue-600 bg-blue-700 bg-blue-800 bg-blue-900
bg-opacity-0 bg-opacity-25 bg-opacity-50 bg-opacity-75 bg-opacity-100

// Borders
border border-0 border-2 border-4 border-8
border-t border-t-0 border-t-2 border-t-4 border-t-8
border-r border-r-0 border-r-2 border-r-4 border-r-8
border-b border-b-0 border-b-2 border-b-4 border-b-8
border-l border-l-0 border-l-2 border-l-4 border-l-8
border-solid border-dashed border-dotted border-none
border-transparent border-current border-black border-white
border-gray-50 border-gray-100 border-gray-200 border-gray-300 border-gray-400 border-gray-500 border-gray-600 border-gray-700 border-gray-800 border-gray-900
border-red-50 border-red-100 border-red-200 border-red-300 border-red-400 border-red-500 border-red-600 border-red-700 border-red-800 border-red-900
border-blue-50 border-blue-100 border-blue-200 border-blue-300 border-blue-400 border-blue-500 border-blue-600 border-blue-700 border-blue-800 border-blue-900
border-green-50 border-green-100 border-green-200 border-green-300 border-green-400 border-green-500 border-green-600 border-green-700 border-green-800 border-green-900
border-orange-50 border-orange-100 border-orange-200 border-orange-300 border-orange-400 border-orange-500 border-orange-600 border-orange-700 border-orange-800 border-orange-900
border-opacity-0 border-opacity-25 border-opacity-50 border-opacity-75 border-opacity-100
rounded-none rounded-sm rounded rounded-md rounded-lg rounded-xl rounded-2xl rounded-3xl rounded-full
rounded-t-none rounded-t-sm rounded-t rounded-t-md rounded-t-lg rounded-t-xl rounded-t-2xl rounded-t-3xl rounded-t-full
rounded-r-none rounded-r-sm rounded-r rounded-r-md rounded-r-lg rounded-r-xl rounded-r-2xl rounded-r-3xl rounded-r-full
rounded-b-none rounded-b-sm rounded-b rounded-b-md rounded-b-lg rounded-b-xl rounded-b-2xl rounded-b-3xl rounded-b-full
rounded-l-none rounded-l-sm rounded-l rounded-l-md rounded-l-lg rounded-l-xl rounded-l-2xl rounded-l-3xl rounded-l-full

// Effects
shadow-sm shadow shadow-md shadow-lg shadow-xl shadow-2xl shadow-inner shadow-none
opacity-0 opacity-5 opacity-10 opacity-20 opacity-25 opacity-30 opacity-40 opacity-50 opacity-60 opacity-70 opacity-75 opacity-80 opacity-90 opacity-95 opacity-100

// Transitions & Animation
transition-none transition-all transition transition-colors transition-opacity transition-shadow transition-transform
duration-75 duration-100 duration-150 duration-200 duration-300 duration-500 duration-700 duration-1000
ease-linear ease-in ease-out ease-in-out
animate-none animate-spin animate-ping animate-pulse animate-bounce

// Text Colors
text-transparent text-current text-black text-white
text-gray-50 text-gray-100 text-gray-200 text-gray-300 text-gray-400 text-gray-500 text-gray-600 text-gray-700 text-gray-800 text-gray-900
text-red-50 text-red-100 text-red-200 text-red-300 text-red-400 text-red-500 text-red-600 text-red-700 text-red-800 text-red-900
text-orange-50 text-orange-100 text-orange-200 text-orange-300 text-orange-400 text-orange-500 text-orange-600 text-orange-700 text-orange-800 text-orange-900
text-green-50 text-green-100 text-green-200 text-green-300 text-green-400 text-green-500 text-green-600 text-green-700 text-green-800 text-green-900
text-blue-50 text-blue-100 text-blue-200 text-blue-300 text-blue-400 text-blue-500 text-blue-600 text-blue-700 text-blue-800 text-blue-900
text-opacity-0 text-opacity-25 text-opacity-50 text-opacity-75 text-opacity-100

// Interactivity
cursor-auto cursor-default cursor-pointer cursor-wait cursor-text cursor-move cursor-not-allowed cursor-grab cursor-grabbing
pointer-events-none pointer-events-auto
resize resize-none resize-y resize-x
outline-none focus:outline-none
focus:ring focus:ring-0 focus:ring-1 focus:ring-2 focus:ring-4 focus:ring-8
focus:ring-offset-0 focus:ring-offset-1 focus:ring-offset-2 focus:ring-offset-4 focus:ring-offset-8
focus:ring-red-500 focus:ring-blue-500 focus:ring-green-500
focus:border-red-500 focus:border-blue-500 focus:border-green-500

// Hover States
hover:bg-gray-50 hover:bg-gray-100 hover:bg-gray-200 hover:bg-gray-300 hover:bg-gray-400 hover:bg-gray-500 hover:bg-gray-600 hover:bg-gray-700 hover:bg-gray-800 hover:bg-gray-900
hover:bg-red-50 hover:bg-red-100 hover:bg-red-200 hover:bg-red-300 hover:bg-red-400 hover:bg-red-500 hover:bg-red-600 hover:bg-red-700 hover:bg-red-800 hover:bg-red-900
hover:bg-blue-50 hover:bg-blue-100 hover:bg-blue-200 hover:bg-blue-300 hover:bg-blue-400 hover:bg-blue-500 hover:bg-blue-600 hover:bg-blue-700 hover:bg-blue-800 hover:bg-blue-900
hover:bg-green-50 hover:bg-green-100 hover:bg-green-200 hover:bg-green-300 hover:bg-green-400 hover:bg-green-500 hover:bg-green-600 hover:bg-green-700 hover:bg-green-800 hover:bg-green-900
hover:bg-orange-50 hover:bg-orange-100 hover:bg-orange-200 hover:bg-orange-300 hover:bg-orange-400 hover:bg-orange-500 hover:bg-orange-600 hover:bg-orange-700 hover:bg-orange-800 hover:bg-orange-900
hover:text-gray-50 hover:text-gray-100 hover:text-gray-200 hover:text-gray-300 hover:text-gray-400 hover:text-gray-500 hover:text-gray-600 hover:text-gray-700 hover:text-gray-800 hover:text-gray-900
hover:text-red-50 hover:text-red-100 hover:text-red-200 hover:text-red-300 hover:text-red-400 hover:text-red-500 hover:text-red-600 hover:text-red-700 hover:text-red-800 hover:text-red-900
hover:text-blue-50 hover:text-blue-100 hover:text-blue-200 hover:text-blue-300 hover:text-blue-400 hover:text-blue-500 hover:text-blue-600 hover:text-blue-700 hover:text-blue-800 hover:text-blue-900
hover:border-gray-300 hover:border-blue-500 hover:border-red-500 hover:border-green-500

// Disabled States
disabled:bg-gray-300 disabled:bg-gray-400 disabled:bg-gray-500
disabled:opacity-50 disabled:opacity-75
disabled:cursor-not-allowed

// Various specific classes used in your components
sr-only container inline-block inline-flex
overflow-hidden overflow-y-auto whitespace-pre-wrap
bg-black bg-opacity-50
border-t-blue-500 border-r-blue-500 border-b-blue-500 border-l-blue-500
h-[40px] max-h-[90vh]

*/
