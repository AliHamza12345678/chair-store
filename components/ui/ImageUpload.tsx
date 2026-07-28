"use client"

import { CldUploadWidget } from "next-cloudinary"
import { Button } from "@/components/ui/Button"
import { ImagePlus, Trash } from "lucide-react"
import { useState } from "react"
import { Input } from "./Input"

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [fallbackUrl, setFallbackUrl] = useState("")

  const onUpload = (result: any) => {
  console.log(result)
  onChange(result.info.secure_url)
}

  // If Cloudinary environment variables are missing, fallback to URL input
  if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME === "your-cloud-name") {
    return (
      <div className="space-y-4">
        {value && (
          <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden border">
            <img src={value} alt="Upload" className="object-cover w-full h-full" />
            <div className="absolute top-2 right-2">
              <Button type="button" onClick={() => onChange("")} variant="destructive" size="icon">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        {!value && (
          <div className="flex gap-2">
            <Input 
              placeholder="Cloudinary not configured. Paste Image URL..." 
              value={fallbackUrl} 
              onChange={(e) => setFallbackUrl(e.target.value)} 
            />
            <Button type="button" onClick={() => onChange(fallbackUrl)} variant="secondary">
              Set URL
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {value && (
        <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden border mb-4">
          <img src={value} alt="Upload" className="object-cover w-full h-full" />
          <div className="absolute top-2 right-2">
            <Button type="button" onClick={() => onChange("")} variant="destructive" size="icon">
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      {!value && (
        <CldUploadWidget
  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
  onSuccess={(result: any) => {
    console.log("Cloudinary:", result)

    const url =
      result?.info?.secure_url ||
      result?.info?.url ||
      ""

    onChange(url)
  }}
>
  {({ open }) => {
    const onClick = (e: React.MouseEvent) => {
      e.preventDefault()
      open()
    }

    return (
      <Button
        type="button"
        disabled={disabled}
        variant="secondary"
        onClick={onClick}
      >
        <ImagePlus className="h-4 w-4 mr-2" />
        Upload an Image
      </Button>
    )
  }}
</CldUploadWidget>
      )}
    </div>
  )
}
