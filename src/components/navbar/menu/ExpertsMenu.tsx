import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { expertCategoryLabels } from "@/components/expert-dashboard/layout/sidebar/navigationConfig";

export const ExpertsMenu = () => {
  const expertCategories = [
    {
      key: 'listening-volunteer',
      path: '/experts/listening-volunteer',
      description: 'Compassionate listeners providing emotional support'
    },
    {
      key: 'listening-expert',
      path: '/experts/listening-expert', 
      description: 'Professional listening experts with therapeutic training'
    },
    {
      key: 'mindfulness-expert',
      path: '/experts/mindfulness-expert',
      description: 'Certified mindfulness practitioners and meditation guides'
    },
    {
      key: 'life-coach',
      path: '/experts/life-coach',
      description: 'Professional coaches for personal and professional growth'
    },
    {
      key: 'spiritual-mentor',
      path: '/experts/spiritual-mentor',
      description: 'Experienced guides for spiritual growth and inner wisdom'
    }
  ] as const;

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="text-gray-700 hover:text-gray-900 font-medium">
        Experts
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid gap-3 p-6 md:w-[500px] lg:w-[600px] lg:grid-cols-2">
          <div className="row-span-3">
            <NavigationMenuLink asChild>
              <Link
                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                to="/experts"
              >
                <div className="mb-2 mt-4 text-lg font-medium">
                  Browse All Experts
                </div>
                <p className="text-sm leading-tight text-muted-foreground">
                  Discover our community of verified experts ready to support your wellness journey.
                </p>
              </Link>
            </NavigationMenuLink>
          </div>
          
          <div className="grid gap-3">
            {expertCategories.map((category) => (
              <NavigationMenuLink key={category.key} asChild>
                <Link
                  to={category.path}
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div className="text-sm font-medium leading-none">
                    {expertCategoryLabels[category.key as keyof typeof expertCategoryLabels]}
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {category.description}
                  </p>
                </Link>
              </NavigationMenuLink>
            ))}
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};