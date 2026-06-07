import type { ComponentType } from "react";
import {
  IoRestaurantOutline,
  IoCarOutline,
  IoBagHandleOutline,
  IoGameControllerOutline,
  IoHeartOutline,
  IoFlashOutline,
  IoBookOutline,
  IoPeopleOutline,
  IoCafeOutline,
  IoAirplaneOutline,
  IoMusicalNotesOutline,
  IoPawOutline,
  IoShirtOutline,
  IoHomeOutline,
  IoBriefcaseOutline,
  IoGiftOutline,
} from "react-icons/io5";

export const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  Utensils: IoRestaurantOutline,
  Car: IoCarOutline,
  ShoppingBag: IoBagHandleOutline,
  Gamepad2: IoGameControllerOutline,
  HeartPulse: IoHeartOutline,
  Zap: IoFlashOutline,
  BookOpen: IoBookOutline,
  Users: IoPeopleOutline,
  Coffee: IoCafeOutline,
  Plane: IoAirplaneOutline,
  Music: IoMusicalNotesOutline,
  Dog: IoPawOutline,
  Shirt: IoShirtOutline,
  Home: IoHomeOutline,
  Briefcase: IoBriefcaseOutline,
  Gift: IoGiftOutline,
};

export const defaultIconList = Object.keys(iconMap);
