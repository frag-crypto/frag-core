<!-- Lol i wish... -->
<mwc-drawer has-header="false">
    <!-- <span slot="title">Drawer Title</span>
    <span slot="subtitle">subtitle</span> -->
            <div>
        <wallet-profile></wallet-profile>

        <sidenav-menu drawer-toggle></sidenav-menu>

    </div>
    <div slot="appContent">
        <mwc-top-app-bar hasHeader="false">
            <div slot="title">${this.config.coin.name}</div>
        </mwc-top-app-bar>
        <div>
            <show-plugin size='100' logged-in="{{loggedIn}}" config="{{config}}" current-plugin-frame="{{currentPluginFrame}}" route="{{route}}" data="{{routeData}}" subroute="{{subroute}}" url="{{activeUrl}}"></show-plugin>
        </div>
    </div>
</mwc-drawer>
