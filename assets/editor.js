const isSelectorPanelAvailable = $scope => {
    return $scope.parentScope.showLeftSidebar
        && !$scope.styleSetActive
        && $scope.selectedNodeType !== 'selectorfolder'
        && $scope.selectedNodeType !== 'cssfolder'
        && $scope.component.active.name
        && $scope.component.active.name != 'root'
        && $scope.component.active.name != 'ct_inner_content'
        && !$scope.isEditing('style-sheet')
        && !$scope.parentScope.isActiveName('ct_reusable')
        && !$scope.parentScope.isActiveName('ct_template')
        && !$scope.parentScope.isActiveActionTab('componentBrowser');
}

const relocatePlainClassesInputArea = () => {
    // add toggle button
    let sibling = document.querySelector('.oxygen-select.oxygen-active-selector-box-wrapper');
    let child = document.getElementById('dplugins-pc-toggle');
    sibling.parentNode.insertBefore(child, sibling.nextSibling);

    // add oxywind input area
    sibling = document.querySelector('.oxygen-media-query-and-selector-wrapper');
    child = document.getElementById('dplugins-pc-wrapper');
    sibling.parentNode.insertBefore(child, sibling.nextSibling);
};

if (!window.hasOwnProperty('deferAlpine')) {
    window.deferAlpine = 0;
}

window.deferAlpine++;

document.addEventListener("DOMContentLoaded", async () => {
    let $scope = null;

    // Wait for the editor to be ready
    await new Promise(resolve => {
        let waitingForScope = setInterval(() => {
            let _scope = angular.element(window.top.document.body).scope();

            if (
                _scope !== undefined
                && _scope.iframeScope !== false
                && window.hasOwnProperty('Alpine')
            ) {
                clearInterval(waitingForScope);
                resolve();
            }
        }, 1000);
    });

    const Alpine = window.Alpine;

    $scope = angular.element(window.top.document.body).scope().iframeScope;

    // switch binding to the selected id
    $scope.$watch('component.active.id', (newValue, oldValue) => {
        if (newValue > 0 && isSelectorPanelAvailable($scope)) {
            componentIdChanged();
        }
    });

    relocatePlainClassesInputArea();

    const setPlainClassesToTreeComponent = (key, item, _) => {
        let newData = Alpine.store('plain_classes').data;

        if (!('options' in item) || ('plain_classes' in item.options && item.options.plain_classes == newData)) {
            return;
        }

        item.options.plain_classes = newData;
    };

    const setPlainClassesFromTreeComponent = (key, item, _) => {
        Alpine.store('plain_classes').data = 'plain_classes' in item.options ? item.options.plain_classes : '';
    };

    const componentIdChanged = () => {
        if ($scope.component.active.id) {
            $scope.findComponentItem(
                $scope.componentsTree.children,
                $scope.component.active.id,
                setPlainClassesFromTreeComponent
            );
        }
    }

    window.plain_classes = {
        componentIdChanged: componentIdChanged,
    };

    const plainClassesWatcher = (newValue, oldValue) => {
        let id = $scope.component.active.id;

        if (!('componentsPlainClasses' in $scope)) {
            $scope.componentsPlainClasses = [];
        }

        // check if component has any classes
        if ($scope.componentsClasses[id]) {
            if ($scope.componentsPlainClasses[id]) {
                let oldKey = $scope.componentsClasses[id].indexOf($scope.componentsPlainClasses[id]);

                if (oldKey > -1) {
                    $scope.componentsClasses[id].splice(oldKey, 1);
                }
            }
        } else {
            $scope.componentsClasses[id] = [];
        }

        if (newValue != '') {
            $scope.componentsClasses[id].push(newValue);
            $scope.componentsPlainClasses[id] = newValue;
        } else {
            if ($scope.componentsPlainClasses[id]) {
                delete $scope.componentsPlainClasses[id];
            }
        }

        $scope.findComponentItem(
            $scope.componentsTree.children,
            id,
            setPlainClassesToTreeComponent
        );
    }

    document.addEventListener('alpine:init', () => {
        Alpine.store('visiblePanel', false);

        Alpine.store('plain_classes', {
            data: ''
        });

        Alpine.store('plainClassesWatcher', plainClassesWatcher);
    });

    window.deferAlpine--;
});

