"use client"

import { useState, useEffect, Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { Item } from "@/types/item"
import { createItem, updateItem, getItems } from "@/lib/api/items"
import { getItemTypes } from "@/lib/api/item-types"
import { getPriceCodes } from "@/lib/api/price-codes"
import { PriceCode } from "@/types/price-code"

const formSchema = z.object({
  item_number: z.string().min(1, "Item number is required"),
  brand: z.string().min(1, "Brand is required"),
  model_type: z.string().min(1, "Model type is required"),
  gender: z.string().min(1, "Gender is required"),
  brake_type: z.string().min(1, "Brake type is required"),
  frame_height: z.string().min(1, "Frame height is required"),
  wheel_size: z.string().min(1, "Wheel size is required"),
  color: z.string().min(1, "Color is required"),
  year: z.coerce.number().min(1900, "Valid year is required"),
  license_plate: z.string().min(1, "License plate is required"),
  lock_type: z.string().min(1, "Lock type is required"),
  frame_number: z.string().min(1, "Frame number is required"),
  key_number: z.string().min(1, "Key number is required"),
  lock_number: z.string().min(1, "Lock number is required"),
  status: z.enum(["available", "maintenance", "defect"]),
  item_type_id: z.number().min(1, "Item type is required"),
  price_code_id: z.number().min(1, "Price code is required"),
})

interface ItemFormProps {
  open: boolean
  setOpen: (open: boolean) => void
  onSaved: (items: Item[]) => void
  initialData?: Item
}

export function ItemForm({ open, setOpen, onSaved, initialData }: ItemFormProps) {
  const { toast } = useToast()
  const [itemTypes, setItemTypes] = useState<{ id: number; name: string }[]>([])
  const [priceCodes, setPriceCodes] = useState<PriceCode[]>([])
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      item_number: "",
      brand: "",
      model_type: "",
      gender: "",
      brake_type: "",
      frame_height: "",
      wheel_size: "",
      color: "",
      year: new Date().getFullYear(),
      license_plate: "",
      lock_type: "",
      frame_number: "",
      key_number: "",
      lock_number: "",
      status: "available",
      item_type_id: 0,
      price_code_id: 0,
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        item_type_id: initialData.item_type_id,
        price_code_id: initialData.price_code_id,
      })
    } else {
      form.reset()
    }
  }, [initialData, form, open])

  useEffect(() => {
    getItemTypes().then(setItemTypes)
    getPriceCodes().then(setPriceCodes)
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      console.log("Form values being submitted:", values)
      
      if (initialData) {
        await updateItem(initialData.id, values)
        toast({
          title: "Success",
          description: "Item updated successfully",
        })
      } else {
        await createItem(values)
        toast({
          title: "Success",
          description: "Item created successfully",
        })
      }
      setOpen(false)
      const updatedItems = await getItems()
      onSaved(updatedItems)
    } catch (error) {
      console.error("Form submission error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  {initialData ? 'Edit Item' : 'Add Item'}
                </Dialog.Title>

                <div className="max-h-[60vh] overflow-y-auto pr-2 -mr-2">
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label htmlFor="item_number" className="block text-sm font-medium text-gray-700">
                        Item Number
                      </label>
                      <input
                        {...form.register("item_number")}
                        type="text"
                        id="item_number"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {form.formState.errors.item_number && (
                        <p className="text-sm text-red-500">{form.formState.errors.item_number.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                        Brand
                      </label>
                      <input
                        {...form.register("brand")}
                        type="text"
                        id="brand"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {form.formState.errors.brand && (
                        <p className="text-sm text-red-500">{form.formState.errors.brand.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="model_type" className="block text-sm font-medium text-gray-700">
                        Model Type
                      </label>
                      <input
                        {...form.register("model_type")}
                        type="text"
                        id="model_type"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {form.formState.errors.model_type && (
                        <p className="text-sm text-red-500">{form.formState.errors.model_type.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                        Gender
                      </label>
                      <input
                        {...form.register("gender")}
                        type="text"
                        id="gender"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {form.formState.errors.gender && (
                        <p className="text-sm text-red-500">{form.formState.errors.gender.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="brake_type" className="block text-sm font-medium text-gray-700">
                        Brake Type
                      </label>
                      <input
                        {...form.register("brake_type")}
                        type="text"
                        id="brake_type"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {form.formState.errors.brake_type && (
                        <p className="text-sm text-red-500">{form.formState.errors.brake_type.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="frame_height" className="block text-sm font-medium text-gray-700">
                        Frame Height
                      </label>
                      <input
                        {...form.register("frame_height")}
                        type="text"
                        id="frame_height"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {form.formState.errors.frame_height && (
                        <p className="text-sm text-red-500">{form.formState.errors.frame_height.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="wheel_size" className="block text-sm font-medium text-gray-700">
                        Wheel Size
                      </label>
                      <input
                        {...form.register("wheel_size")}
                        type="text"
                        id="wheel_size"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {form.formState.errors.wheel_size && (
                        <p className="text-sm text-red-500">{form.formState.errors.wheel_size.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                        Color
                      </label>
                      <input
                        {...form.register("color")}
                        type="text"
                        id="color"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {form.formState.errors.color && (
                        <p className="text-sm text-red-500">{form.formState.errors.color.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                        Year
                      </label>
                      <input
                        {...form.register("year")}
                        type="number"
                        id="year"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {form.formState.errors.year && (
                        <p className="text-sm text-red-500">{form.formState.errors.year.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="license_plate" className="block text-sm font-medium text-gray-700">
                        License Plate
                      </label>
                      <input
                        {...form.register("license_plate")}
                        type="text"
                        id="license_plate"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {form.formState.errors.license_plate && (
                        <p className="text-sm text-red-500">{form.formState.errors.license_plate.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lock_type" className="block text-sm font-medium text-gray-700">
                        Lock Type
                      </label>
                      <input
                        {...form.register("lock_type")}
                        type="text"
                        id="lock_type"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {form.formState.errors.lock_type && (
                        <p className="text-sm text-red-500">{form.formState.errors.lock_type.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="frame_number" className="block text-sm font-medium text-gray-700">
                        Frame Number
                      </label>
                      <input
                        {...form.register("frame_number")}
                        type="text"
                        id="frame_number"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {form.formState.errors.frame_number && (
                        <p className="text-sm text-red-500">{form.formState.errors.frame_number.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="key_number" className="block text-sm font-medium text-gray-700">
                        Key Number
                      </label>
                      <input
                        {...form.register("key_number")}
                        type="text"
                        id="key_number"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {form.formState.errors.key_number && (
                        <p className="text-sm text-red-500">{form.formState.errors.key_number.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lock_number" className="block text-sm font-medium text-gray-700">
                        Lock Number
                      </label>
                      <input
                        {...form.register("lock_number")}
                        type="text"
                        id="lock_number"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {form.formState.errors.lock_number && (
                        <p className="text-sm text-red-500">{form.formState.errors.lock_number.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <select
                        {...form.register("status")}
                        id="status"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="available">Available</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="defect">Defect</option>
                      </select>
                      {form.formState.errors.status && (
                        <p className="text-sm text-red-500">{form.formState.errors.status.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="item_type_id" className="block text-sm font-medium text-gray-700">
                        Item Type
                      </label>
                      <select
                        {...form.register("item_type_id", { valueAsNumber: true })}
                        id="item_type_id"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="">Select item type</option>
                        {itemTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                      {form.formState.errors.item_type_id && (
                        <p className="text-sm text-red-500">{form.formState.errors.item_type_id.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="price_code_id" className="block text-sm font-medium text-gray-700">
                        Price Code
                      </label>
                      <select
                        {...form.register("price_code_id", { valueAsNumber: true })}
                        id="price_code_id"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="">Select price code</option>
                        {priceCodes.map((code) => (
                          <option key={code.id} value={code.id}>
                            {code.code} – {code.label}
                          </option>
                        ))}
                      </select>
                      {form.formState.errors.price_code_id && (
                        <p className="text-sm text-red-500">{form.formState.errors.price_code_id.message}</p>
                      )}
                    </div>
                  </form>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={loading}
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    {loading ? 'Saving...' : initialData ? 'Update' : 'Save'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
} 