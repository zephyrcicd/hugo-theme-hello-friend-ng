// macOS风格代码块装饰
(function() {
    // 尽早执行，减少闪烁
    function addMacOSStyle() {
        const codeToolbars = document.querySelectorAll('div.code-toolbar');

        codeToolbars.forEach(toolbar => {
            // 检查是否已经添加了macOS装饰
            if (toolbar.querySelector('.mac-window-controls')) return;

            const pre = toolbar.querySelector('pre[class*="language-"]');
            if (!pre) return;

            // 创建macOS窗口控制按钮
            const macControls = document.createElement('div');
            macControls.className = 'mac-window-controls';

            // 创建三个按钮（关闭、最小化、最大化）
            const closeBtn = document.createElement('div');
            closeBtn.className = 'mac-btn mac-close';
            closeBtn.title = '关闭';

            const minimizeBtn = document.createElement('div');
            minimizeBtn.className = 'mac-btn mac-minimize';
            minimizeBtn.title = '最小化';

            const maximizeBtn = document.createElement('div');
            maximizeBtn.className = 'mac-btn mac-maximize';
            maximizeBtn.title = '最大化';

            macControls.appendChild(closeBtn);
            macControls.appendChild(minimizeBtn);
            macControls.appendChild(maximizeBtn);

            // 创建顶部栏容器
            const headerBar = document.createElement('div');
            headerBar.className = 'mac-header-bar';
            headerBar.appendChild(macControls);

            // 获取或创建语言/文件名标签
            const toolbarDiv = toolbar.querySelector('.toolbar');
            if (toolbarDiv) {
                const langLabel = toolbarDiv.querySelector('.toolbar-item span');
                if (langLabel) {
                    // 创建标题文本
                    const titleText = document.createElement('div');
                    titleText.className = 'mac-title';
                    titleText.textContent = langLabel.textContent || 'Code';
                    headerBar.appendChild(titleText);
                }
            }

            // 将macOS风格顶部栏添加到代码块前
            toolbar.insertBefore(headerBar, toolbar.firstChild);

            // 添加macOS风格类到容器
            toolbar.classList.add('mac-style');

            // 为按钮添加交互效果（修改：移除关闭功能）
            closeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                // 红色按钮不执行任何操作，仅作装饰
            });

            minimizeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                // 切换代码块显示/隐藏
                const isMinimized = pre.style.display === 'none';
                pre.style.display = isMinimized ? 'block' : 'none';
                if (isMinimized) {
                    toolbar.classList.remove('minimized');
                } else {
                    toolbar.classList.add('minimized');
                }
            });

            maximizeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                // 切换全屏模式
                toolbar.classList.toggle('maximized');
                if (toolbar.classList.contains('maximized')) {
                    // 创建遮罩层
                    const overlay = document.createElement('div');
                    overlay.className = 'mac-overlay';
                    overlay.addEventListener('click', function() {
                        toolbar.classList.remove('maximized');
                        overlay.remove();
                    });
                    document.body.appendChild(overlay);

                    // 添加ESC键监听
                    const escHandler = function(event) {
                        if (event.key === 'Escape' || event.keyCode === 27) {
                            toolbar.classList.remove('maximized');
                            const existingOverlay = document.querySelector('.mac-overlay');
                            if (existingOverlay) existingOverlay.remove();
                            document.removeEventListener('keydown', escHandler);
                        }
                    };
                    document.addEventListener('keydown', escHandler);

                    // 保存handler引用，以便移除
                    toolbar.escHandler = escHandler;
                } else {
                    // 移除遮罩层和事件监听
                    const overlay = document.querySelector('.mac-overlay');
                    if (overlay) overlay.remove();
                    if (toolbar.escHandler) {
                        document.removeEventListener('keydown', toolbar.escHandler);
                        delete toolbar.escHandler;
                    }
                }
            });
        });
    }

    // 立即执行一次，减少闪烁
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            addMacOSStyle();
            // 延迟再执行一次，确保Prism完成渲染
            setTimeout(addMacOSStyle, 100);
        });
    } else {
        // 如果DOM已经加载完成，立即执行
        addMacOSStyle();
        setTimeout(addMacOSStyle, 100);
    }

    // 监听DOM变化
    const observer = new MutationObserver(() => {
        addMacOSStyle();
    });

    // 更早开始观察
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
})();