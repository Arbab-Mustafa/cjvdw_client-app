"use client"

import { Button } from "@/components/ui/button"
import { SkipBackIcon as Backspace } from "lucide-react"

interface OnScreenKeyboardProps {
  onKeyPress: (key: string) => void
}

export function OnScreenKeyboard({ onKeyPress }: OnScreenKeyboardProps) {
  const rows = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m", "@", "."],
  ]

  return (
    <div className="flex flex-col gap-1">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 justify-center">
          {row.map((key) => (
            <Button
              key={key}
              variant="outline"
              className="h-10 w-10 p-0 text-center border-pink-100"
              onClick={() => onKeyPress(key)}
            >
              {key}
            </Button>
          ))}
        </div>
      ))}
      <div className="flex gap-1 justify-center mt-1">
        <Button variant="outline" className="h-10 px-3 border-pink-100" onClick={() => onKeyPress("backspace")}>
          <Backspace className="h-4 w-4" />
        </Button>
        <Button variant="outline" className="h-10 flex-1 border-pink-100" onClick={() => onKeyPress("space")}>
          Space
        </Button>
        <Button variant="outline" className="h-10 px-3 border-pink-100" onClick={() => onKeyPress("clear")}>
          Clear
        </Button>
      </div>
    </div>
  )
}
