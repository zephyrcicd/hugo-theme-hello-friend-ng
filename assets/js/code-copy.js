// 代码块复制功能
document.addEventListener('DOMContentLoaded', function() {
    // 查找所有的toolbar中的语言标签
    const addCopyButtons = () => {
        const codeBlocks = document.querySelectorAll('div.code-toolbar');

        codeBlocks.forEach(toolbar => {
            // 检查是否已经添加了复制按钮
            if (toolbar.querySelector('.copy-button')) return;

            const pre = toolbar.querySelector('pre[class*="language-"]');
            if (!pre) return;

            const code = pre.querySelector('code');
            if (!code) return;

            // 查找toolbar容器
            let toolbarDiv = toolbar.querySelector('.toolbar');
            if (!toolbarDiv) {
                // 如果没有toolbar，创建一个
                toolbarDiv = document.createElement('div');
                toolbarDiv.className = 'toolbar';
                toolbar.appendChild(toolbarDiv);
            }

            // 查找语言标签
            const langLabel = toolbarDiv.querySelector('.toolbar-item span');

            if (langLabel) {
                // 将语言标签转换为可点击的复制按钮
                langLabel.style.cursor = 'pointer';
                langLabel.title = '点击复制代码';
                langLabel.classList.add('copy-button');

                // 添加点击事件
                langLabel.addEventListener('click', function(e) {
                    e.preventDefault();
                    copyCode(code, langLabel);
                });
            } else {
                // 如果没有语言标签，创建一个复制按钮
                const copyButton = document.createElement('span');
                copyButton.className = 'copy-button';
                copyButton.textContent = '复制';
                copyButton.style.cursor = 'pointer';
                copyButton.title = '点击复制代码';

                const buttonWrapper = document.createElement('div');
                buttonWrapper.className = 'toolbar-item';
                buttonWrapper.appendChild(copyButton);
                toolbarDiv.appendChild(buttonWrapper);

                copyButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    copyCode(code, copyButton);
                });
            }
        });
    };

    // 复制代码函数
    const copyCode = (codeElement, buttonElement) => {
        // 获取代码文本，排除行号
        let codeText = '';
        const codeLines = codeElement.textContent || codeElement.innerText;

        // 如果有行号，需要特殊处理
        const pre = codeElement.closest('pre');
        if (pre && pre.classList.contains('line-numbers')) {
            // 获取所有文本内容，但排除行号
            const lines = codeLines.split('\n');
            // 移除可能的空行
            codeText = lines.filter(line => line.trim()).join('\n');
        } else {
            codeText = codeLines;
        }

        // 创建临时textarea元素
        const textarea = document.createElement('textarea');
        textarea.value = codeText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);

        // 选择并复制文本
        textarea.select();
        textarea.setSelectionRange(0, 99999); // 移动端兼容

        try {
            document.execCommand('copy');

            // 保存原始文本
            const originalText = buttonElement.textContent;
            const originalBg = buttonElement.style.background;

            // 显示复制成功反馈
            buttonElement.textContent = '已复制!';
            buttonElement.style.background = 'rgba(76, 175, 80, 0.3)';

            // 2秒后恢复原始状态
            setTimeout(() => {
                buttonElement.textContent = originalText;
                buttonElement.style.background = originalBg;
            }, 2000);
        } catch (err) {
            console.error('复制失败:', err);
            buttonElement.textContent = '复制失败';
            setTimeout(() => {
                buttonElement.textContent = buttonElement.textContent.replace('复制失败', '复制');
            }, 2000);
        }

        // 移除临时元素
        document.body.removeChild(textarea);
    };

    // 初始化
    setTimeout(addCopyButtons, 500);

    // 监听DOM变化，动态添加复制按钮
    const observer = new MutationObserver(() => {
        setTimeout(addCopyButtons, 100);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});