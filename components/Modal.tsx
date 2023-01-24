import { Fragment, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import { classNames } from "helpers/tailwind";

interface ModalProps {
  isActive: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({
  title,
  children,
  isActive,
  onClose,
}: ModalProps) {
  return (
    <Transition.Root show={isActive} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-y-auto z-50"
        onClose={onClose}
      >
        <div className="flex items-end sm:items-center justify-center h-screen w-screen">
          {/* Overlay */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-700/20 transition-opacity" />
          </Transition.Child>

          {/* Content */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="bg-white sm:rounded-lg px-4 pt-5 pb-4 sm:shadow-xl transition-all sm:my-8 sm:max-w-sm w-full sm:p-6">
              <div
                className={classNames(
                  "flex mb-3 items-center",
                  title ? "justify-center" : "justify-start"
                )}
              >
                <button
                  className="border-2 cursor-pointer items-center rounded-full shrink-0 h-6 w-6 flex justify-center select-none border-gray-400 mr-2"
                  onClick={onClose}
                >
                  <ArrowLeftIcon
                    className="h-3 w-3 text-black"
                    aria-hidden="true"
                  />
                </button>
                <div className="font-semibold text-xl md:text-2xl">
                  {" "}
                  {title && <span className="font-bold">{title}</span>}
                </div>
              </div>
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
