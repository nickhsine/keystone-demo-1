import { NavigationContainer, ListNavItems, NavItem } from '@keystone-6/core/admin-ui/components';
import type { NavigationProps } from '@keystone-6/core/admin-ui/components';


export function Navigation({ lists, authenticatedItem }: NavigationProps) {
    return (
        <NavigationContainer authenticatedItem={authenticatedItem}>
            <NavItem href="/">Dashboard</NavItem>
            <ListNavItems lists={lists} />
            <NavItem href="/network-b-categories">Network B Categories</NavItem>
            <NavItem href="/network-b-promotions">Network B Promotions</NavItem>
            <NavItem href="/bubble-promotions">Bubble Promotions</NavItem>
        </NavigationContainer>
    )
}