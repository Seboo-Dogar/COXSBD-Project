import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Settings,
  ChevronLeft,
  ChevronDown,
  FileText,
  Home,
  MessageSquare,
  Gift,
  Server,
  Globe,
  Code,
  Wifi,
  ShoppingCart,
  Bus,
  Car,
  Hotel,
  Plane,
} from "lucide-react";
import { cn } from "@/lib/utils";

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface MenuItemConfig {
  title: string;
  url?: string;
  icon: IconType;
  badge?: string;
  children?: MenuItemConfig[];
  key?: string;
}

const menuItems: MenuItemConfig[] = [
  {
    title: "Dashboard",
    url: "/account",
    icon: Home,
  },
  {
    title: "Order",
    url: "/order-tracking",
    icon: Home,
    badge: "3",
  },

  {
    title: "Cars",
    url: "/admin/car",
    icon: Car,
  },
  {
    title: "Bus",
    url: "/admin/bus",
    icon: Bus,
  },
  {
    title: "Hotels",
    url: "/admin/hotel",
    icon: Hotel,
  },
  {
    title: "Flights",
    icon: Plane,
    key: "flights",
    children: [
      {
        title: "Flights",
        url: "/admin/flights",
        icon: Plane,
      },
      {
        title: "Flights Airports",
        url: "/admin/flights/airports",
        icon: Plane,
      },
      {
        title: "Flights Airlines",
        url: "/admin/flights/airlines",
        icon: Plane,
      },
      {
        title: "Flights Featured",
        url: "/admin/flights/featured",
        icon: Plane,
      },
      {
        title: "Flights Suggestions",
        url: "/admin/flights/suggestions",
        icon: Plane,
      },
    ],
  },
  {
    title: "Tour Package",
    icon: Globe,
    key: "tours",
    children: [
      {
        title: "Tours",
        url: "/admin/tours",
        icon: Globe,
      },
      {
        title: "Tour Suggestions",
        url: "/admin/tours/suggestions",
        icon: Globe,
      },
      {
        title: "Tour Settings",
        url: "/admin/tours/settings",
        icon: Globe,
      },
    ],
  },
  {
    title: "Visa Service",
    icon: Package,
    key: "visa-service",
    children: [
      {
        title: "Visa Countries",
        url: "/admin/visa/countries",
        icon: Package,
      },
      {
        title: "Visa Bookings",
        url: "/admin/visa/bookings",
        icon: Package,
      },
    ],
  },
  {
    title: "Ecommerce",
    icon: ShoppingCart,
    key: "ecommerce",
    children: [
      {
        title: "Electronics",
        url: "/admin/ecommerce/electronics",
        icon: ShoppingCart,
      },
      {
        title: "Mobile",
        url: "/admin/ecommerce/mobile",
        icon: ShoppingCart,
      },
      {
        title: "Computer",
        url: "/admin/ecommerce/computer",
        icon: ShoppingCart,
      },
    ],
  },
  {
    title: "Web Hosting",
    url: "/admin/web-hosting",
    icon: Server,
  },
  {
    title: "Dedicated Server",
    url: "/admin/dedicated-server",
    icon: Server,
  },
  {
    title: "Cloud VPS",
    url: "/admin/cloud-vps",
    icon: Server,
  },
  {
    title: "Domain",
    url: "/admin/domain",
    icon: Globe,
  },
  {
    title: "Software Script",
    url: "/admin/software-script",
    icon: Code,
  },
  {
    title: "Wifi Data",
    url: "/admin/wifi-data",
    icon: Wifi,
  },
  {
    title: "Licenses",
    url: "/admin/license",
    icon: FileText,
  },
  {
    title: "Offers",
    url: "/admin/offers",
    icon: Gift,
  },
  {
    title: "Messages",
    url: "/dashboard/messages",
    icon: MessageSquare,
    badge: "5",
  },
];

const secondaryItems: MenuItemConfig[] = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

interface MenuItemProps {
  item: MenuItemConfig;
  collapsed: boolean;
  pathname: string;
  level?: number;
}

function MenuItem({ item, collapsed, pathname, level = 0 }: MenuItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.url ? pathname.startsWith(item.url) : false;
  const isChildActive =
    hasChildren &&
    item.children!.some((child) => child.url && pathname.startsWith(child.url));

  useEffect(() => {
    if (isChildActive) setIsOpen(true);
  }, [isChildActive]);

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen((prev) => !prev);
    }
  };

  // Check if icon is a React component or a string/JSX element
  const renderIcon = () => {
    if (
      typeof item.icon === "function" ||
      (item.icon && typeof item.icon === "object" && "render" in item.icon)
    ) {
      const IconComponent = item.icon as React.ComponentType<
        React.SVGProps<SVGSVGElement>
      >;
      return (
        <IconComponent
          className={cn(
            "h-4 w-4 transition-colors",
            isActive || isChildActive
              ? "text-primary-600 dark:text-primary-400"
              : "text-muted-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400"
          )}
        />
      );
    }
    return null;
  };

  const content = (
    <div
      className={cn(
        "flex items-center rounded-lg px-3 py-2 text-sm transition-all duration-200 group",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isActive || isChildActive
          ? "bg-primary-50/80 dark:bg-primary-900/25 text-primary-700 dark:text-primary-100 border-r-2 border-primary-500"
          : "text-muted-foreground hover:text-foreground hover:bg-primary-50/60 dark:hover:bg-primary-900/15",
        collapsed ? "justify-center" : "justify-between",
        level > 0 && "ml-4"
      )}
    >
      <div className="flex items-center min-w-0 gap-2">
        <div className="h-4 w-4 shrink-0 flex items-center justify-center">
          {renderIcon()}
        </div>
        {!collapsed && (
          <span
            className={cn(
              "truncate text-[13px] leading-5",
              (isActive || isChildActive) && "font-semibold text-foreground"
            )}
          >
            {item.title}
          </span>
        )}
      </div>

      {!collapsed && (
        <div className="flex items-center gap-1 ml-2">
          {item.badge && (
            <span
              className={cn(
                "px-1.5 py-0.5 text-[11px] font-medium rounded-full",
                isActive || isChildActive
                  ? "bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-100"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <ChevronDown
              className={cn(
                "h-3 w-3 text-muted-foreground transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          )}
        </div>
      )}
    </div>
  );

  if (hasChildren) {
    return (
      <div className="w-full">
        <button
          type="button"
          onClick={handleClick}
          aria-expanded={isOpen}
          className="w-full text-left"
        >
          {content}
        </button>

        {!collapsed && (
          <div
            className={cn(
              "mt-1 space-y-0.5 overflow-hidden transition-[max-height,opacity] duration-200",
              isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            {item.children!.map((child, index) => (
              <Link key={index} href={child.url!} className="block">
                <MenuItem
                  item={child}
                  collapsed={collapsed}
                  pathname={pathname}
                  level={level + 1}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href={item.url!} className="block">
      {content}
    </Link>
  );
}

function CollapsedMenuItem({
  item,
  pathname,
}: {
  item: MenuItemConfig;
  pathname: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const isActive = item.url ? pathname.startsWith(item.url) : false;
  const hasChildren = item.children && item.children.length > 0;

  // Check if icon is a React component
  const renderIcon = () => {
    if (
      typeof item.icon === "function" ||
      (item.icon && typeof item.icon === "object" && "render" in item.icon)
    ) {
      const IconComponent = item.icon as React.ComponentType<
        React.SVGProps<SVGSVGElement>
      >;
      return (
        <IconComponent
          className={cn(
            "h-4 w-4",
            isActive
              ? "text-primary-600 dark:text-primary-400"
              : "text-muted-foreground"
          )}
        />
      );
    }
    return null;
  };

  const button = (
    <button
      type="button"
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isActive
          ? "bg-primary-50/80 dark:bg-primary-900/25 text-primary-700 dark:text-primary-100"
          : "text-foreground hover:bg-primary-50/60 dark:hover:bg-primary-900/20"
      )}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="h-4 w-4 flex items-center justify-center">
        {renderIcon()}
      </div>
      {item.badge && !hasChildren && (
        <span className="absolute -top-1 -right-1 flex h-4 min-w-[1.1rem] items-center justify-center rounded-full bg-primary-500 px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
          {item.badge}
        </span>
      )}
    </button>
  );

  return (
    <div className="relative">
      {item.url && !hasChildren ? (
        <Link
          href={item.url}
          className="block"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {button}
        </Link>
      ) : (
        button
      )}

      {showTooltip && (
        <div className="absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2">
          <div className="relative rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-50 shadow-lg">
            {item.title}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
          </div>
        </div>
      )}
    </div>
  );
}

const Sidebar = ({ setMobileOpen, mobileOpen, panelTitle }: any) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity lg:hidden",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-background/95 border-r border-slate-200 dark:border-slate-800 shadow-sm",
          "transition-all duration-300 ease-out",
          collapsed ? "w-16" : "w-64",
          "lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand + collapse */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight text-foreground">
                  {panelTitle}
                </span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800",
              collapsed && "mx-auto"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 text-primary-500 transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Menu Section */}
          <div className="space-y-4">
            {!collapsed && (
              <div className="px-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-600 dark:text-primary-400">
                  Main Menu
                </span>
              </div>
            )}
            <div
              className={cn(
                "space-y-1.5",
                collapsed && "flex flex-col items-center gap-2"
              )}
            >
              {menuItems.map((item, index) =>
                collapsed ? (
                  <CollapsedMenuItem
                    key={index}
                    item={item}
                    pathname={pathname}
                  />
                ) : (
                  <MenuItem
                    key={index}
                    item={item}
                    collapsed={collapsed}
                    pathname={pathname}
                  />
                )
              )}
            </div>
          </div>
        </nav>

        {/* Secondary section */}
        <div
          className={cn(
            "border-t border-slate-200 px-3 py-3 dark:border-slate-800",
            collapsed ? "flex flex-col items-center gap-2" : "space-y-2"
          )}
        >
          {!collapsed && (
            <div className="px-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-600 dark:text-primary-400">
                Quick Access
              </span>
            </div>
          )}

          {secondaryItems.map((item, index) =>
            collapsed ? (
              <CollapsedMenuItem key={index} item={item} pathname={pathname} />
            ) : (
              <Link
                key={index}
                href={item.url!}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors group",
                  pathname.startsWith(item.url!)
                    ? "bg-primary-50/80 dark:bg-primary-900/25 text-primary-700 dark:text-primary-100"
                    : "text-muted-foreground hover:text-foreground hover:bg-primary-50/60 dark:hover:bg-primary-900/15"
                )}
              >
                <div className="h-4 w-4 shrink-0 flex items-center justify-center">
                  {typeof item.icon === "function" ||
                  (item.icon &&
                    typeof item.icon === "object" &&
                    "render" in item.icon) ? (
                    <item.icon
                      className={cn(
                        "h-4 w-4",
                        pathname.startsWith(item.url!)
                          ? "text-primary-600 dark:text-primary-400"
                          : "text-muted-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400"
                      )}
                    />
                  ) : null}
                </div>
                <span className="ml-3 truncate text-[13px]">{item.title}</span>
                {item.badge && (
                  <span
                    className={cn(
                      "ml-auto px-1.5 py-0.5 text-[11px] font-medium rounded-full",
                      pathname.startsWith(item.url!)
                        ? "bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-100"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          )}
        </div>

        {/* User profile */}
        <div
          className={cn(
            "border-t border-slate-200 px-3 py-3 dark:border-slate-800",
            collapsed ? "flex justify-center" : ""
          )}
        >
          {collapsed ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-xs font-medium text-primary-foreground">
              JD
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-xs font-medium text-primary-foreground">
                JD
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  John Doe
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  Administrator
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
