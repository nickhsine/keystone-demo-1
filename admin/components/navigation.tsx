import { NavigationContainer, ListNavItems, NavItem } from '@keystone-6/core/admin-ui/components';
import type { NavigationProps } from '@keystone-6/core/admin-ui/components';


export function Navigation({ lists, authenticatedItem }: NavigationProps) {
    return (
        <NavigationContainer authenticatedItem={authenticatedItem}>
            <NavItem href="/">Dashboard</NavItem>
            <ListNavItems lists={lists} />
            {/* <NavItem href="/bubble-test">Bubble</NavItem>
            <NavItem href="/nb-test">NB</NavItem> */}
            <NavItem href="/api-data">API Data</NavItem>
            <NavItem href="/api-reconcilliation">API Reconcilliation</NavItem>
            {/* <NavItem href="/api-gpt">API Reconcilliation</NavItem> */}
        </NavigationContainer>
    )
}