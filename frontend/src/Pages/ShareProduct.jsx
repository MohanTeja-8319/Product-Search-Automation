import React from "react";
import toast from "react-hot-toast";

const ShareProduct = ({ productName }) => {

 const shareLink = window.location.href;

 const copyLink = () => {
 navigator.clipboard.writeText(shareLink);
 toast.success("Link copied to clipboard!");
 };

 return (
 <div className="bg-white border border-gray-200 rounded-[10px] mt-6">

 <div className="px-6 py-5 border-b">

 <h2 className="text-2xl font-bold">

 Share Product

 </h2>

 <p className="text-gray-500 mt-1">

 Share this comparison with your friends.

 </p>

 </div>

 <div className="p-6">

 <div className="flex flex-wrap gap-4">

 {}

 <a
 href={`https://wa.me/?text=${encodeURIComponent(
 `${productName}\n${shareLink}`
 )}`}
 target="_blank"
 rel="noreferrer"
 className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-[10px] transition"
 >
  WhatsApp
 </a>

 {}

 <a
 href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
 `${productName}\n${shareLink}`
 )}`}
 target="_blank"
 rel="noreferrer"
 className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-[10px] transition"
 >
  Twitter
 </a>

 {}

 <a
 href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
 shareLink
 )}`}
 target="_blank"
 rel="noreferrer"
 className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-[10px] transition"
 >
  Facebook
 </a>

 {}

 <button
 onClick={copyLink}
 className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-[10px] transition"
 >
  Copy Link
 </button>

 </div>

 </div>

 </div>
 );
};

export default ShareProduct;