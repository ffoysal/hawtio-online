/// <reference types="angular" />
/// <reference types="kubernetes-api" />
/// <reference types="core" />
declare namespace Online {
    class DiscoverController {
        private $scope;
        private $window;
        private pfViewUtils;
        private K8SClientFactory;
        _loading: number;
        pods: any[];
        filteredPods: any[];
        projects: any[];
        toolbarConfig: any;
        viewType: any;
        constructor($scope: ng.IScope, $window: ng.IWindowService, pfViewUtils: any, K8SClientFactory: KubernetesAPI.K8SClientFactory);
        $onInit(): void;
        loading(): boolean;
        open(url: any): boolean;
        getStatusClasses(pod: any, status: any): string;
    }
}
declare namespace Online {
    interface HttpSrcDirectiveScope extends ng.IScope {
        objectURL: string;
    }
    class HttpSrcDirective implements ng.IDirective {
        private $http;
        scope: {
            httpSrc: '@';
        };
        constructor($http: ng.IHttpService);
        link(scope: HttpSrcDirectiveScope, elem: JQuery, attrs: ng.IAttributes): void;
    }
}
declare namespace Online {
    class MatchHeightDirective implements ng.IDirective {
        private $timeout;
        restrict: 'A';
        constructor($timeout: ng.ITimeoutService);
        link(scope: ng.IScope): void;
    }
}
declare namespace Online {
    const labelsModule: angular.IModule;
}
declare namespace Online {
    const statusModule: angular.IModule;
}
declare namespace Online {
    const discoverModule: angular.IModule;
}
declare namespace Online {
    const log: Logging.Logger;
}
declare namespace Online {
    class AboutController {
        private configManager;
        flags: {
            open: boolean;
        };
        title: string;
        productInfo: object[];
        additionalInfo: string;
        copyright: string;
        constructor(configManager: Core.ConfigManager);
        $onInit(): void;
        onClose(): void;
    }
    const aboutComponent: angular.IComponentOptions;
}
declare namespace Online {
}
declare namespace Online {
    function isPodReady(pod: any): any;
}
declare namespace Online {
    interface LabelsDirectiveScope extends ng.IScope {
        labels: {
            [key: string]: string;
        };
        clickable?: boolean;
        kind?: string;
        projectName?: string;
        limit?: number;
        titleKind?: string;
        navigateUrl?: string;
        filterCurrentPage?: boolean;
        filterAndNavigate?: (key: string, value?: string) => void;
    }
    class LabelsDirective implements ng.IDirective {
        restrict: string;
        scope: {
            labels: string;
            clickable: string;
            kind: string;
            projectName: string;
            limit: string;
            titleKind: string;
            navigateUrl: string;
            filterCurrentPage: string;
        };
        templateUrl: string;
        constructor($location: ng.ILocationService, $timeout: ng.ITimeoutService);
        link(scope: LabelsDirectiveScope): void;
    }
}