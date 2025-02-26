export interface NavigationParams {
    [key: string]: string | number | boolean | undefined
}

const gotoPage = (
    url: string,
    target: '_blank' | '_self' | '_parent' | '_top' = '_self',
    params: NavigationParams = {},
    rel: string = 'noopener noreferrer'
): void | Window | null => {
    try {

        if (!url) {
            throw new Error('URL is required')
        }

        const urlObject = new URL(url, window.location.href)

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                urlObject.searchParams.append(key, String(value))
            }
        })

        const finalUrl = urlObject.toString()

        if (target === '_self') {
            window.location.href = finalUrl
            return
        }

        const newWindow = window.open(finalUrl, target)

        if (newWindow && target === '_blank') {
            newWindow.opener = null

            try {
                const linkEl = document.createElement('a')
                linkEl.rel = rel
                newWindow.document.head.appendChild(linkEl)
            } catch (e) {
                console.warn('Unable to set rel attribute on new window:', e)
            }
        }

        return newWindow
    } catch (error) {
        console.error('Navigation error:', error)
        throw error
    }
}

export default gotoPage
