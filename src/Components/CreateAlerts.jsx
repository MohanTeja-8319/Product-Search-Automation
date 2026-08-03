import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiSearch, FiChevronDown, FiX, FiArrowRight, FiBell } from "react-icons/fi";

import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import dummyProducts from "../data/products";
import comparisonProducts from "../data/comparisionProducts";

const CreateAlert = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const searchWrapRef = useRef(null);

    const [selectedProduct, setSelectedProduct] = useState(null);

    const [search, setSearch] = useState("");

    const [showSuggestions, setShowSuggestions] = useState(false);

    const [store, setStore] = useState("");

    const [targetPrice, setTargetPrice] = useState("");

    const [notifyPriceDrop, setNotifyPriceDrop] = useState(true);

    const [notifyStock, setNotifyStock] = useState(false);

    const [email, setEmail] = useState(true);

    const [push, setPush] = useState(true);

    const [sms, setSms] = useState(false);

    const [frequency, setFrequency] = useState("Instant");

    useEffect(() => {

        if (!id) return;

        const product = dummyProducts.find(
            (item) => item.id === Number(id)
        );

        if (product) {

            setSelectedProduct(product);

            setTargetPrice(product.price);

            const stores = comparisonProducts[product.name];

            if (stores && stores.length > 0) {

                setStore(stores[0].store);

            } else {

                setStore(product.store);

            }

        }

    }, [id]);

    // Close the suggestions dropdown on outside click

    useEffect(() => {

        const handleClickOutside = (e) => {

            if (
                searchWrapRef.current &&
                !searchWrapRef.current.contains(e.target)
            ) {
                setShowSuggestions(false);
            }

        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);

    }, []);

    const filteredProducts =
        search.trim().length === 0
            ? []
            : dummyProducts
                  .filter((item) =>
                      item.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .slice(0, 6);

    const handleSelectProduct = (product) => {

        setSelectedProduct(product);

        setTargetPrice(product.price);

        const stores = comparisonProducts[product.name];

        if (stores && stores.length > 0) {

            setStore(stores[0].store);

        } else {

            setStore(product.store);

        }

        setSearch("");

        setShowSuggestions(false);

    };

    const handleRemoveProduct = () => {

        setSelectedProduct(null);

        setTargetPrice("");

        setStore("");

    };

    const handleCreateAlert = () => {

        if (!selectedProduct) return;

        const alerts =
            JSON.parse(localStorage.getItem("priceAlerts")) || [];

        const alreadyExists = alerts.find(
            (item) => item.productId === selectedProduct.id
        );

        if (alreadyExists) {

            alert("Price Alert already exists!");

            return;

        }

        const newAlert = {

            id: Date.now(),

            productId: selectedProduct.id,

            productName: selectedProduct.name,

            image: selectedProduct.image,

            currentPrice: selectedProduct.price,

            targetPrice: Number(targetPrice),

            store,

            notifyPriceDrop,

            notifyStock,

            email,

            push,

            sms,

            frequency,

            active: true,

            createdAt: new Date().toLocaleString(),

        };

        alerts.push(newAlert);

        localStorage.setItem("priceAlerts", JSON.stringify(alerts));

        alert("Price Alert Created Successfully!");

        navigate("/pricealerts");

    };

    const storeOptions =
        selectedProduct && comparisonProducts[selectedProduct.name]
            ? comparisonProducts[selectedProduct.name]
            : selectedProduct
            ? [{ store: selectedProduct.store }]
            : [];

    const current = selectedProduct ? selectedProduct.price : 0;

    const target = Number(targetPrice) || 0;

    const saving = current - target;

    const percentage =
        current > 0 && saving > 0
            ? ((saving / current) * 100).toFixed(2)
            : "0.00";

    return (

    <div className="bg-[#f8fafc] min-h-screen text-gray-800">

        {/* Sidebar */}

        <Sidebar />

        {/* Main Content */}

        <div className="ml-0 lg:ml-72 flex flex-col min-h-screen">

            {/* Navbar */}

            <Navbar />

            {/* Content */}

            <main className="flex-1 p-4 md:p-6 lg:p-8">

                {/* Page Header */}

                <div className="mb-8">

                    <h1 className="text-2xl font-bold text-gray-950">
                        Create Alert
                    </h1>

                    <p className="text-gray-400 mt-1 text-sm font-semibold">
                        Set up a price alert and get notified when the price drops.
                    </p>

                </div>

                {/* Progress Stepper */}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">

                    <div className="flex items-center">

                        {/* Step 1 */}

                        <div className="flex items-center">

                            <div className="w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center font-extrabold text-sm bg-indigo-600 text-white">
                                1
                            </div>

                            <div className="ml-4 hidden sm:block">
                                <h3 className="font-bold text-gray-950 text-xs leading-tight">
                                    Alert Details
                                </h3>
                                <p className="text-[10px] font-semibold text-gray-400 mt-1">
                                    Choose product and target price
                                </p>
                            </div>

                        </div>

                        {/* Line */}

                        <div className="flex-1 h-0.5 mx-4 rounded-full bg-indigo-600"></div>

                        {/* Step 2 */}

                        <div className="flex items-center">

                            <div className="w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center font-extrabold text-sm bg-indigo-100 text-indigo-600">
                                2
                            </div>

                            <div className="ml-4 hidden sm:block">
                                <h3 className="font-bold text-gray-950 text-xs leading-tight">
                                    Alert Settings
                                </h3>
                                <p className="text-[10px] font-semibold text-gray-400 mt-1">
                                    Set preferences
                                </p>
                            </div>

                        </div>

                        {/* Line */}

                        <div className="flex-1 h-0.5 mx-4 rounded-full bg-gray-100"></div>

                        {/* Step 3 */}

                        <div className="flex items-center">

                            <div className="w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center font-extrabold text-sm bg-gray-100 text-gray-400">
                                3
                            </div>

                            <div className="ml-4 hidden sm:block">
                                <h3 className="font-bold text-gray-950 text-xs leading-tight">
                                    Review &amp; Save
                                </h3>
                                <p className="text-[10px] font-semibold text-gray-400 mt-1">
                                    Confirm and activate
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

                {/* ---------------- 1. Select Product ---------------- */}

                <div className="mb-10">

                    <div className="mb-4">

                        <h2 className="text-xl font-bold text-gray-950">
                            1. Select Product
                        </h2>

                        <p className="text-gray-400 mt-1 text-xs font-semibold">
                            Search and select the product you want to track.
                        </p>

                    </div>

                    {!selectedProduct ? (

                        <div className="relative" ref={searchWrapRef}>

                            <input

                                type="text"

                                value={search}

                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setShowSuggestions(true);
                                }}

                                onFocus={() => setShowSuggestions(true)}

                                placeholder="Search for a product..."

                                className="w-full rounded-xl border border-gray-100 bg-white py-4 pl-14 pr-5 outline-none text-sm font-semibold text-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"

                            />

                            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                            {/* Suggestions dropdown */}

                            {showSuggestions && filteredProducts.length > 0 && (

                                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden max-h-80 overflow-y-auto">

                                    {filteredProducts.map((product) => (

                                        <div

                                            key={product.id}

                                            onClick={() => handleSelectProduct(product)}

                                            className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-gray-50/40 border-b border-gray-100/60 last:border-b-0"

                                        >

                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-10 h-10 object-contain flex-shrink-0"
                                            />

                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-xs text-gray-900 truncate">
                                                    {product.name}
                                                </p>
                                                <p className="text-[10px] font-semibold text-gray-400">
                                                    {product.brand}
                                                </p>
                                            </div>

                                            <span className="text-xs font-extrabold text-indigo-600 flex-shrink-0">
                                                ₹{product.price.toLocaleString()}
                                            </span>

                                        </div>

                                    ))}

                                </div>

                            )}

                            {showSuggestions &&
                                search.trim().length > 0 &&
                                filteredProducts.length === 0 && (

                                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg p-4 text-xs font-semibold text-gray-400">
                                    No products found.
                                </div>

                            )}

                        </div>

                    ) : (

                        <div className="border border-gray-100 rounded-xl p-4 bg-white flex items-center gap-4">

                            <img

                                src={selectedProduct.image}

                                alt={selectedProduct.name}

                                className="w-16 h-16 object-contain flex-shrink-0"

                            />

                            <div className="flex-1 min-w-0">

                                <h3 className="font-bold text-sm text-gray-950 truncate">
                                    {selectedProduct.name}
                                </h3>

                                <p className="text-xs font-semibold text-gray-400 mt-0.5">
                                    {selectedProduct.brand}
                                </p>

                            </div>

                            {/* Store selector */}

                            <div className="flex items-center gap-2 border border-gray-100 rounded-lg px-3 py-2 flex-shrink-0">

                                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                                    {store ? store.charAt(0) : "?"}
                                </span>

                                <select

                                    value={store}

                                    onChange={(e) => setStore(e.target.value)}

                                    className="appearance-none bg-transparent outline-none text-xs font-bold text-gray-700 pr-1"

                                >

                                    {storeOptions.map((item, index) => (
                                        <option key={index} value={item.store}>
                                            {item.store}
                                        </option>
                                    ))}

                                </select>

                                <FiChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />

                            </div>

                            <button

                                onClick={handleRemoveProduct}

                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg flex-shrink-0 transition duration-200 cursor-pointer"

                                aria-label="Remove product"

                            >
                                <FiX className="text-base" />
                            </button>

                        </div>

                    )}

                </div>

                {/* ---------------- 2. Set Target Price ---------------- */}

                <div className="mb-10">

                    <div className="mb-4">

                        <h2 className="text-xl font-bold text-gray-950">
                            2. Set Target Price
                        </h2>

                        <p className="text-gray-400 mt-1 text-xs font-semibold">
                            You will be notified when the price drops to or below this amount.
                        </p>

                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 border border-gray-100 rounded-2xl overflow-hidden bg-white">

                        {/* Current Price */}

                        <div className="p-6 border-b lg:border-b-0 lg:border-r border-gray-100">

                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                                Current Price
                            </p>

                            <h2 className="text-2xl font-extrabold text-gray-950 mt-3">
                                {selectedProduct
                                    ? `₹${selectedProduct.price.toLocaleString()}`
                                    : "—"}
                            </h2>

                            <p className="text-gray-400 text-xs font-semibold mt-3">
                                {store || "—"}
                            </p>

                        </div>

                        {/* Target Price */}

                        <div className="p-6 border-b lg:border-b-0 lg:border-r border-gray-100">

                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
                                Target Price
                            </p>

                            <div className="flex items-center border border-gray-100 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">

                                <span className="px-4 text-lg font-bold text-gray-400">
                                    ₹
                                </span>

                                <input

                                    type="number"

                                    value={targetPrice}

                                    onChange={(e) => setTargetPrice(e.target.value)}

                                    disabled={!selectedProduct}

                                    className="flex-1 py-3 pr-4 outline-none text-lg font-semibold text-gray-950 disabled:bg-white disabled:text-gray-300"

                                />

                            </div>

                        </div>

                        {/* Expected Drop */}

                        <div className="p-6">

                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                                Expected Drop
                            </p>

                            <h2 className="text-2xl font-extrabold text-green-600 mt-3">
                                ↓ {percentage}%
                            </h2>

                            <p className="text-gray-400 text-xs font-semibold mt-3">
                                You save{" "}
                                <span className="font-extrabold text-gray-950">
                                    ₹{saving > 0 ? saving.toLocaleString() : 0}
                                </span>
                            </p>

                        </div>

                    </div>

                </div>

                {/* ---------------- 3. Alert Preferences ---------------- */}

                <div className="mb-10">

                    <div className="mb-4">

                        <h2 className="text-xl font-bold text-gray-950">
                            3. Alert Preferences
                        </h2>

                        <p className="text-gray-400 mt-1 text-xs font-semibold">
                            Choose how and when you want to receive alerts.
                        </p>

                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Notify Me On */}

                        <div className="bg-white border border-gray-100 rounded-2xl p-6">

                            <h3 className="font-bold text-sm text-gray-950 mb-5">
                                Notify Me On
                            </h3>

                            <div className="space-y-4">

                                <label className="flex items-center gap-3 cursor-pointer">

                                    <input

                                        type="checkbox"

                                        checked={notifyPriceDrop}

                                        onChange={() =>
                                            setNotifyPriceDrop(!notifyPriceDrop)
                                        }

                                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"

                                    />

                                    <span className="text-gray-700 text-xs font-semibold">
                                        Price Drop
                                    </span>

                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">

                                    <input

                                        type="checkbox"

                                        checked={notifyStock}

                                        onChange={() =>
                                            setNotifyStock(!notifyStock)
                                        }

                                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"

                                    />

                                    <span className="text-gray-700 text-xs font-semibold">
                                        Back In Stock
                                    </span>

                                </label>

                            </div>

                        </div>

                        {/* Notification Channels */}

                        <div className="bg-white border border-gray-100 rounded-2xl p-6">

                            <h3 className="font-bold text-sm text-gray-950 mb-5">
                                Notification Channels
                            </h3>

                            <div className="space-y-4">

                                <label className="flex items-center gap-3 cursor-pointer">

                                    <input

                                        type="checkbox"

                                        checked={email}

                                        onChange={() => setEmail(!email)}

                                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"

                                    />

                                    <span className="text-gray-700 text-xs font-semibold">
                                        Email
                                    </span>

                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">

                                    <input

                                        type="checkbox"

                                        checked={push}

                                        onChange={() => setPush(!push)}

                                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"

                                    />

                                    <span className="text-gray-700 text-xs font-semibold">
                                        Push Notification
                                    </span>

                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">

                                    <input

                                        type="checkbox"

                                        checked={sms}

                                        onChange={() => setSms(!sms)}

                                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"

                                    />

                                    <span className="text-gray-700 text-xs font-semibold">
                                        SMS
                                    </span>

                                </label>

                            </div>

                        </div>

                        {/* Alert Frequency */}

                        <div className="bg-white border border-gray-100 rounded-2xl p-6">

                            <h3 className="font-bold text-sm text-gray-950 mb-5">
                                Alert Frequency
                            </h3>

                            <div className="space-y-4">

                                <label className="flex items-center gap-3 cursor-pointer">

                                    <input

                                        type="radio"

                                        name="frequency"

                                        value="Instant"

                                        checked={frequency === "Instant"}

                                        onChange={(e) => setFrequency(e.target.value)}

                                        className="accent-indigo-600 w-4 h-4 cursor-pointer"

                                    />

                                    <span className="text-xs font-semibold text-gray-700">
                                        Instant
                                    </span>

                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">

                                    <input

                                        type="radio"

                                        name="frequency"

                                        value="Daily"

                                        checked={frequency === "Daily"}

                                        onChange={(e) => setFrequency(e.target.value)}

                                        className="accent-indigo-600 w-4 h-4 cursor-pointer"

                                    />

                                    <span className="text-xs font-semibold text-gray-700">
                                        Daily Summary
                                    </span>

                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">

                                    <input

                                        type="radio"

                                        name="frequency"

                                        value="Weekly"

                                        checked={frequency === "Weekly"}

                                        onChange={(e) => setFrequency(e.target.value)}

                                        className="accent-indigo-600 w-4 h-4 cursor-pointer"

                                    />

                                    <span className="text-xs font-semibold text-gray-700">
                                        Weekly Summary
                                    </span>

                                </label>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ---------------- Action Buttons ---------------- */}

                <div className="flex flex-col sm:flex-row justify-end gap-4 mb-10">

                    <button

                        onClick={() => navigate(-1)}

                        className="px-8 py-3 border border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition duration-200 font-bold text-xs cursor-pointer"

                    >
                        Cancel
                    </button>

                    <button

                        onClick={handleCreateAlert}

                        disabled={!selectedProduct}

                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition duration-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"

                    >
                        Continue
                        <FiArrowRight className="text-sm" />
                    </button>

                </div>

                {/* ---------------- Info Card ---------------- */}

                
                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col lg:flex-row justify-between items-center gap-6">

    <div className="flex items-center gap-5">

        <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 flex-shrink-0">

            <FiBell className="w-6 h-6" />

        </div>

        <div>

            <h3 className="text-sm font-bold text-gray-950">
                You're in Control.
            </h3>

            <p className="text-gray-400 mt-1 text-xs font-semibold">
                You can edit, pause or delete alerts anytime from your Price Alerts page.
            </p>

        </div>

    </div>

    <a
        href="#learn-more"
        onClick={(e) => e.preventDefault()}
        className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition flex-shrink-0"
    >
        Learn More
        <FiArrowRight className="text-sm" />
    </a>

</div>

            </main>

        </div>

    </div>

    );

};

export default CreateAlert;