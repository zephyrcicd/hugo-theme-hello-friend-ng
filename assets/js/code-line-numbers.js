// 为所有代码块添加行号功能
document.addEventListener('DOMContentLoaded', function() {
    // 查找所有代码块
    const codeBlocks = document.querySelectorAll('pre[class*="language-"]');

    codeBlocks.forEach(function(pre) {
        // 添加 line-numbers 类
        if (!pre.classList.contains('line-numbers')) {
            pre.classList.add('line-numbers');
        }
    });

    // 如果Prism已加载，重新高亮代码
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
});