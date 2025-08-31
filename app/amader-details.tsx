"use client"

import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type Category = { title: string; items: string[] }

const CATEGORIES: Category[] = [
  {
    title: "Drainage",
    items: [
      "Covered/Nali drains",
      "Soak pits (for grey water management)",
      "Storm water ducts",
      "Culverts across drains",
    ],
  },
  {
    title: "Water Supply",
    items: [
      "Tube wells",
      "Stand posts (water pipes connected with distribution system)",
      "Piped water supply",
      "Public water drinking facilities",
      "Overhead tanks",
    ],
  },
  { title: "Street Lighting", items: ["LED street lights", "Solar lights", "High mast lights"] },
  {
    title: "Community Toilets",
    items: ["Toilet blocks", "Public lavatories in market areas", "Gender-segregated facilities"],
  },
  {
    title: "ICDS Centres (Upgrading)",
    items: [
      "Roofing repairs",
      "Drinking water tap installation",
      "Play zone creation",
      "Boundary wall fixing",
      "Safe flooring",
    ],
  },
  { title: "Primary Schools", items: ["Painting", "Toilet repair", "Drinking water points", "Benches or roof repair"] },
  { title: "Ponds & Water Bodies", items: ["Desilting", "Fencing", "Re-excavation", "Ghat steps"] },
  { title: "Garbage Management", items: ["Waste bins", "Handcarts", "Compost pits", "Waste disposal zones"] },
  { title: "Public Spaces", items: ["Benches", "Shade structures", "Community shed upgrades"] },
  { title: "Markets & Vending Zones", items: ["Stall repairs", "Drainage", "Platform leveling", "Lighting"] },
  {
    title: "Cultural & Social Infrastructure",
    items: ["Mini-stage", "Flag post", "Shade areas for festivals", "Community centres"],
  },
  {
    title: "Public Transport & Accessibility",
    items: [
      "Bus stop shades",
      "Auto/rickshaw stands",
      "Footpaths & passenger ramps",
      "Foot-bridges over water channels",
      "Ambulances",
    ],
  },
  { title: "Green Infrastructure", items: ["Open gym zones", "Tree guards", "Benches in walking paths/parks"] },
  {
    title: "Electrical Works",
    items: [
      "Public wiring",
      "Electrical repairs in community halls/schools",
      "Transformer pads",
      "Internal electrification",
      "Street pole connections",
      "Power backup for public facilities",
    ],
  },
  { title: "Roads", items: ["Road patchwork & repairs"] },
  { title: "Others", items: ["Any additional works proposed by the public through Paray Samadhan or other portals"] },
]

export function AmaderDetails() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        <img
          src="apas-removebg.png"
          alt="Amader Para, Amader Samadhan logo"
          className="w-40 h-auto md:w-56"
        />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-pretty">Amader Para Amader Samadhan — Details</h3>
        <p className="text-muted-foreground text-sm">
          Explore available public works and community infrastructure options. Expand a category to view specific items.
        </p>
      </div>

      <Card className="p-2 md:p-4">
        <Accordion type="multiple" className="w-full">
          {CATEGORIES.map((cat, idx) => (
            <AccordionItem key={cat.title} value={`item-${idx}`}>
              <AccordionTrigger className="text-left">{cat.title}</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-1">
                  {cat.items.map((it) => (
                    <li key={it} className="text-sm leading-relaxed">
                      {it}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  )
}
