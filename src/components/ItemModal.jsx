"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Radio,
  RadioGroup,
  Switch,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";
import { useCart } from "../contexts/CartContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ItemModal({ open, setOpen, item }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [suggestPrice, setSuggestPrice] = useState(false);
  const [suggestedPrice, setSuggestedPrice] = useState("");
  const [showPriceError, setShowPriceError] = useState(false);
  const { addToCart } = useCart();
  
  // Initialize selectedSize to null when modal opens
  useEffect(() => {
    if (open) {
      // Check if any sizes are in stock
      const inStockSizes = item.sizes.filter(size => size.inStock);
      setSelectedSize(inStockSizes.length > 0 ? inStockSizes[0] : null);
      
      // Reset price suggestion fields
      setSuggestPrice(false);
      setSuggestedPrice("");
      setShowPriceError(false);
    }
  }, [open, item.sizes]);

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));
  };

  const handleQuantityChange = (e) => {
    const inputValue = e.target.value;

    // If input is empty, set the quantity to 0
    if (inputValue === "") {
      setQuantity(0);
    } else {
      // Parse the input as an integer
      const value = parseInt(inputValue, 10) || 0;
      setQuantity(value);
    }
  };

  const handleSuggestedPriceChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and decimal points
    if (/^(\d*\.?\d*)$/.test(value) || value === "") {
      setSuggestedPrice(value);
      setShowPriceError(false);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!selectedSize) return;
    
    // Validate suggested price if enabled
    if (suggestPrice && (!suggestedPrice || parseFloat(suggestedPrice) <= 0)) {
      setShowPriceError(true);
      return;
    }
    
    // Use the selected size's price for the cart item
    const itemWithSelectedPrice = {
      ...item,
      price: selectedSize.price || item.price,
      suggestedPrice: suggestPrice ? parseFloat(suggestedPrice) : null
    };
    
    addToCart(itemWithSelectedPrice, quantity, selectedSize);
    setOpen(false);
  };

  // Check if Add to Cart should be disabled
  const isAddToCartDisabled = !selectedSize || quantity < 1;

  // Calculate total price based on quantity and selected size
  const currentPrice = selectedSize?.price || item.price;

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 hidden bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in md:block"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            aria-hidden="true"
            className="hidden md:inline-block md:h-screen md:align-middle"
          >
            &#8203;
          </span>
          <DialogPanel
            transition
            className="flex w-full transform text-left text-base transition data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in md:my-8 md:max-w-2xl md:px-4 data-[closed]:md:translate-y-0 data-[closed]:md:scale-95 lg:max-w-4xl"
          >
            <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>

              <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:items-center lg:gap-x-8">
                <img
                  alt={item.imageAlt}
                  src={item.imageSrc}
                  className="aspect-[2/3] w-full rounded-lg bg-gray-100 object-cover sm:col-span-4 lg:col-span-5"
                />
                <div className="sm:col-span-8 lg:col-span-7">
                  <h2 className="text-xl font-medium text-gray-900 sm:pr-12">
                    {item.name}
                  </h2>

                  <section
                    aria-labelledby="information-heading"
                    className="mt-3"
                  >
                    <h3 id="information-heading" className="sr-only">
                      Product information
                    </h3>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex flex-col">
                        <div className="flex justify-between items-baseline">
                          <p className="text-2xl font-bold text-gray-900">
                            Rs. {currentPrice}
                          </p>
                          <p className="text-sm text-gray-500">per unit</p>
                        </div>
                        {quantity > 1 && (
                          <p className="text-lg font-medium text-[#c68b2f] mt-1">
                            Total: Rs. {typeof currentPrice === 'string' 
                              ? parseFloat(currentPrice.replace(/[^\d.]/g, '')) * quantity 
                              : currentPrice * quantity}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Reviews */}
                    <div className="mt-4">
                      <h4 className="sr-only">Reviews</h4>
                      <div className="flex items-center">
                        <p className="text-sm text-gray-700">
                          {item.rating}
                          <span className="sr-only"> out of 5 stars</span>
                        </p>
                        <div className="ml-1 flex items-center">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <StarIcon
                              key={rating}
                              aria-hidden="true"
                              className={classNames(
                                item.rating > rating
                                  ? "text-yellow-400"
                                  : "text-gray-200",
                                "size-5 shrink-0"
                              )}
                            />
                          ))}
                        </div>
                        <div className="ml-4 hidden lg:flex lg:items-center">
                          <span aria-hidden="true" className="text-gray-300">
                            &middot;
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section aria-labelledby="options-heading" className="mt-8">
                    <h3 id="options-heading" className="sr-only">
                      Product options
                    </h3>

                    <form onSubmit={handleAddToCart}>
                      {/* Size picker */}
                      <fieldset aria-label="Choose a size" className="my-8">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-900">
                            Size
                          </div>
                          <span className="text-sm font-medium text-[#c68b2f] hover:text-indigo-500">
                            Size guide
                          </span>
                        </div>

                        <RadioGroup
                          value={selectedSize}
                          onChange={setSelectedSize}
                          className="mt-2 grid grid-cols-7 gap-2"
                        >
                          {item.sizes.map((size) => (
                            <Radio
                              key={size.name}
                              value={size}
                              disabled={!size.inStock}
                              className={classNames(
                                size.inStock
                                  ? "cursor-pointer focus:outline-none"
                                  : "cursor-not-allowed opacity-25",
                                "flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-3 text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 data-[checked]:border-transparent data-[checked]:bg-[#c68b2f] data-[checked]:text-white data-[focus]:ring-2 data-[focus]:ring-[#c68b2f] data-[focus]:ring-offset-2 data-[checked]:hover:bg-[#c68b2f] sm:flex-1"
                              )}
                            >
                              {size.name}
                            </Radio>
                          ))}
                        </RadioGroup>
                        {!selectedSize && (
                          <p className="mt-2 text-sm text-red-500">
                            Please select a size
                          </p>
                        )}
                      </fieldset>

                      <div
                        className="py-2 px-3 bg-white border border-gray-200 rounded-lg"
                        data-hs-input-number=""
                      >
                        <div className="w-full flex justify-between items-center gap-x-5">
                          <div className="grow">
                            <span className="block text-xs text-gray-500">
                              Select quantity
                            </span>
                            <input
                              className="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                              style={{ MozAppearance: "textfield" }}
                              type="number"
                              aria-roledescription="Number field"
                              value={quantity === 0 ? "" : quantity}
                              data-hs-input-number-input=""
                              onChange={handleQuantityChange}
                            />
                          </div>
                          <div className="flex justify-end items-center gap-x-1.5">
                            <button
                              type="button"
                              className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                              tabIndex="-1"
                              aria-label="Decrease"
                              data-hs-input-number-decrement=""
                              onClick={decrementQuantity}
                            >
                              <svg
                                className="shrink-0 size-3.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M5 12h14"></path>
                              </svg>
                            </button>
                            <button
                              type="button"
                              className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                              tabIndex="-1"
                              aria-label="Increase"
                              data-hs-input-number-increment=""
                              onClick={incrementQuantity}
                            >
                              <svg
                                className="shrink-0 size-3.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M5 12h14"></path>
                                <path d="M12 5v14"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Suggest price section */}
                      <div className="mt-6">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">Suggest your price</span>
                          <Switch
                            checked={suggestPrice}
                            onChange={setSuggestPrice}
                            className={`${
                              suggestPrice ? 'bg-[#c68b2f]' : 'bg-gray-200'
                            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#c68b2f] focus:ring-offset-2`}
                          >
                            <span className="sr-only">Suggest your price</span>
                            <span
                              className={`${
                                suggestPrice ? 'translate-x-6' : 'translate-x-1'
                              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                            />
                          </Switch>
                        </div>
                        
                        {suggestPrice && (
                          <div className="mt-3">
                            <div className="flex items-center">
                              <span className="mr-2 text-sm text-gray-700">Rs.</span>
                              <input
                                type="text"
                                value={suggestedPrice}
                                onChange={handleSuggestedPriceChange}
                                placeholder="Enter your price"
                                className="block w-full rounded-md border-gray-300 py-1.5 text-gray-900 shadow-sm focus:border-[#c68b2f] focus:ring-[#c68b2f] sm:text-sm"
                              />
                            </div>
                            {showPriceError && (
                              <p className="mt-2 text-sm text-red-500">
                                Please enter a valid price
                              </p>
                            )}
                            <p className="mt-2 text-xs text-gray-500">
                              Suggested price is subject to seller approval
                            </p>
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isAddToCartDisabled}
                        className={`mt-8 flex w-full items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#c68b2f] focus:ring-offset-2 ${
                          isAddToCartDisabled 
                            ? "bg-gray-400 cursor-not-allowed" 
                            : "bg-[#c68b2f] hover:bg-[#a67524]"
                        }`}
                      >
                        {isAddToCartDisabled ? "Select size to add to cart" : "Add to Cart"}
                      </button>
                    </form>
                  </section>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
