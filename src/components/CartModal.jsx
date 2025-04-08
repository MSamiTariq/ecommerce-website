import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, TrashIcon, TagIcon } from "@heroicons/react/24/outline";
import { useCart } from "../contexts/CartContext";

export default function CartModal({ open, setOpen }) {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } =
    useCart();
  const [clearingCart, setClearingCart] = useState(false);

  const handleQuantityChange = (itemId, sizeName, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId, sizeName);
    } else {
      updateQuantity(itemId, sizeName, newQuantity);
    }
  };

  const phoneNumber = "923452102501";

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    // Generate message with all cart items
    let message = "Hello there! I would like to place an order for:\n\n";

    cartItems.forEach((item, index) => {
      // Calculate item subtotal
      const itemSubtotal =
        item.quantity *
        parseFloat(item.price.toString().replace(/[^\d.]/g, ""));

      // Base message with item details and subtotal
      message += `${index + 1}.    ${item.quantity} x ${item.name} (${
        item.weight
      }) - Size: ${item.selectedSize.name}\n    Price: Rs. ${
        item.price
      } per unit\n    Subtotal: Rs. ${itemSubtotal}`;

      // Add suggested price if available
      if (item.suggestedPrice) {
        const suggestedSubtotal = item.quantity * item.suggestedPrice;
        message += `\n    (I'd like to suggest Rs. ${item.suggestedPrice} per unit - Suggested subtotal: Rs. ${suggestedSubtotal})`;
      }

      message += "\n\n";
    });

    // Calculate total based on original prices and suggested prices
    const originalTotal = getCartTotal().toFixed(2);

    // Check if any items have suggested prices
    const hasSuggestedPrices = cartItems.some(
      (item) => item.suggestedPrice !== null
    );

    // Calculate suggested total if there are suggested prices
    if (hasSuggestedPrices) {
      const suggestedTotal = cartItems
        .reduce((total, item) => {
          const price =
            item.suggestedPrice !== null
              ? item.suggestedPrice
              : parseFloat(item.price.toString().replace(/[^\d.]/g, ""));
          return total + price * item.quantity;
        }, 0)
        .toFixed(2);

      message += `\nOriginal Total: Rs. ${originalTotal}`;
      message += `\nSuggested Total: Rs. ${suggestedTotal}`;
    } else {
      message += `\nTotal: Rs. ${originalTotal}`;
    }

    // Encode and send the message
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}/?text=${encodedMessage}`;

    // Open WhatsApp in a new tab and clear cart afterwards
    const newWindow = window.open(whatsappUrl, "_blank");

    // Check if window was successfully opened before clearing cart
    if (newWindow) {
      // Clear cart after a short delay to ensure the redirect happened
      setTimeout(() => {
        clearCart();
        setOpen(false);
      }, 1000);
    }
  };

  const handleClearCart = () => {
    setClearingCart(true);
    setTimeout(() => {
      clearCart();
      setClearingCart(false);
    }, 300);
  };

  // Check if any items have suggested prices
  const hasSuggestedPrices = cartItems.some(
    (item) => item.suggestedPrice !== null
  );

  // Calculate suggested total if applicable
  const suggestedTotal = hasSuggestedPrices
    ? cartItems
        .reduce((total, item) => {
          const price =
            item.suggestedPrice !== null
              ? item.suggestedPrice
              : parseFloat(item.price.toString().replace(/[^\d.]/g, ""));
          return total + price * item.quantity;
        }, 0)
        .toFixed(2)
    : null;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Shopping cart
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center space-x-2">
                          {cartItems.length > 0 && (
                            <button
                              type="button"
                              className="relative -m-2 p-2 text-gray-400 hover:text-red-500"
                              onClick={handleClearCart}
                              disabled={clearingCart}
                            >
                              <span className="absolute -inset-0.5" />
                              <span className="sr-only">Clear cart</span>
                              <TrashIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </button>
                          )}
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          {cartItems.length === 0 ? (
                            <p className="py-6 text-center text-gray-500">
                              Your cart is empty
                            </p>
                          ) : (
                            <ul className="-my-6 divide-y divide-gray-200">
                              {cartItems.map((item) => (
                                <li
                                  key={`${item.id}-${item.selectedSize.name}`}
                                  className="flex py-6"
                                >
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <img
                                      src={item.imageSrc}
                                      alt={item.imageAlt}
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>{item.name}</h3>
                                        <div className="text-right">
                                          <p className="ml-4">
                                            Rs. {item.price}
                                          </p>
                                          {item.suggestedPrice && (
                                            <p className="ml-4 text-sm text-[#c68b2f] flex items-center">
                                              <TagIcon className="h-4 w-4 mr-1" />
                                              Suggested: Rs.{" "}
                                              {item.suggestedPrice}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-500">
                                        Size: {item.selectedSize.name}
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <div className="flex items-center">
                                        <button
                                          type="button"
                                          className="rounded-md border border-gray-300 px-2 py-1 text-gray-700"
                                          onClick={() =>
                                            handleQuantityChange(
                                              item.id,
                                              item.selectedSize.name,
                                              item.quantity - 1
                                            )
                                          }
                                        >
                                          -
                                        </button>
                                        <span className="mx-2 text-gray-700">
                                          Qty {item.quantity}
                                        </span>
                                        <button
                                          type="button"
                                          className="rounded-md border border-gray-300 px-2 py-1 text-gray-700"
                                          onClick={() =>
                                            handleQuantityChange(
                                              item.id,
                                              item.selectedSize.name,
                                              item.quantity + 1
                                            )
                                          }
                                        >
                                          +
                                        </button>
                                      </div>

                                      <div className="flex">
                                        <button
                                          type="button"
                                          className="font-medium text-[#c68b2f] hover:text-[#a67524]"
                                          onClick={() =>
                                            removeFromCart(
                                              item.id,
                                              item.selectedSize.name
                                            )
                                          }
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>Rs. {getCartTotal().toFixed(2)}</p>
                      </div>

                      {hasSuggestedPrices && suggestedTotal && (
                        <div className="flex justify-between text-base font-medium text-[#c68b2f] mt-2">
                          <p>Your suggested total</p>
                          <p>Rs. {suggestedTotal}</p>
                        </div>
                      )}

                      <p className="mt-0.5 text-sm text-gray-500">
                        Shipping and taxes calculated at checkout.
                      </p>
                      <div className="mt-6">
                        <button
                          onClick={handleCheckout}
                          disabled={cartItems.length === 0}
                          className={`flex w-full items-center justify-center rounded-md border border-transparent px-6 py-3 text-base font-medium text-white shadow-sm ${
                            cartItems.length === 0
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-[#c68b2f] hover:bg-[#a67524]"
                          }`}
                        >
                          Checkout via WhatsApp
                        </button>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or{" "}
                          <button
                            type="button"
                            className="font-medium text-[#c68b2f] hover:text-[#a67524]"
                            onClick={() => setOpen(false)}
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
