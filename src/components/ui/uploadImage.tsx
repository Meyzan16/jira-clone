"use client";

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { ImageIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"

interface UploadProps {
  id: string
  label: string
  value: File | string | null
  onChange: (file: File | null) => void
}

const UploadImage = ({ id, label, value, onChange }: UploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    onChange(file)
  }

  return (
    <div className="flex flex-col gap-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="flex items-center gap-x-5">
        {value ? (
          <div className="size-[72px] relative rounded-lg overflow-hidden">
            <Image
              alt="logo"
              fill
              className="object-cover"
              src={value instanceof File ? URL.createObjectURL(value) : value}
            />
          </div>
        ) : (
          <Avatar className="size-[72px]">
            <AvatarFallback>
              <ImageIcon className="size-[46px] text-neutral-400" />
            </AvatarFallback>
          </Avatar>
        )}
        <div className="flex flex-col">
          <p className="text-sm">Workspace Icon</p>
          <p className="text-sm text-muted-foreground">
            JPG, JPEG, PNG, SVG max 2MB
          </p>
          <input
            id={id}
            className="hidden"
            type="file"
            accept=".jpg, .jpeg, .png, .svg"
            ref={inputRef}
            onChange={handleChange}
          />
          <Button
            type="button"
            variant="teritrary"
            size="sm"
            className="w-fit mt-2"
            onClick={() => inputRef.current?.click()}
          >
            Upload Image
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UploadImage
