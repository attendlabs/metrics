"use client";

import { Category } from "@prisma/client";
import { IconType } from "react-icons";
import {
    FcEngineering,
    FcMultipleDevices,
    FcMusic,
    FcOldTimeCamera,
    FcEditImage,
    FcSportsMode
} from "react-icons/fc"
import { CategoryItem } from "./CategoryItem";

interface CategoriesProps {
    items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
    "Computer Science": FcMultipleDevices,
    "Music": FcMusic,
    "Fitness": FcSportsMode,
    "Photography": FcOldTimeCamera,
    "Engineering": FcEngineering,
    "Design": FcEditImage,
};

export const Categories = ({
    items,
}: CategoriesProps) => {
    return (
        <div className="flex items-center gap-x-2 overflow-y-auto pb-2">
            {items.map((item) => (
                <CategoryItem
                    key={item.id}
                    label={item.name}
                    icon={iconMap[item.name]}
                    value={item.id}
                />
            ))}
        </div>
    )
}