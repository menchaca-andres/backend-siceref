export type AndroidNotification = {
    pkg: string
    key?: string
    channel?: string
    when?: number
    title?: string
    text?: string
    bigtext?: string
}

const recordRegex = /NotificationRecord\(0x[0-9a-f]+:\s*pkg=(\S+)/
const keyRegex = /\bkey=([^\s)]+)/
const channelRegex = /channel=(\S+)/
const whenRegex = /^\s*when=(\d+)/
const titleRegex = /android\.title=\S+\s*\((.*)\)\s*$/
const textRegex = /android\.text=\S+\s*\((.*)\)\s*$/
const bigTextRegex = /android\.bigText=\S+\s*\((.*)\)\s*$/
const amountRegex = /(?:Bs\.?|BOB)\s*([0-9]+(?:[\.,][0-9]{1,2})?)/gi

export const NotificationParserService = {
    parse: (dump: string, packages: Set<string>) => {
        const notifications: AndroidNotification[] = []
        const lines = dump.split('\n')
        let index = 0

        while (index < lines.length) {
            const match = recordRegex.exec(lines[index])
            if (!match || !packages.has(match[1])) {
                index++
                continue
            }

            const pkg = match[1]
            let header = lines[index]
            let cursor = index

            while (!header.split('Notification(', 2)[1]?.includes(')') && cursor + 1 < lines.length) {
                cursor++
                header += ` ${lines[cursor].trim()}`
            }

            const notification: AndroidNotification = { pkg }
            const key = keyRegex.exec(header)?.[1]
            const channel = channelRegex.exec(header)?.[1]
            if (key) notification.key = key
            if (channel) notification.channel = channel

            let lineIndex = cursor + 1
            while (lineIndex < lines.length && !lines[lineIndex].includes('NotificationRecord(')) {
                const line = lines[lineIndex]
                const when = whenRegex.exec(line)?.[1]
                const title = titleRegex.exec(line)?.[1]
                const text = textRegex.exec(line)?.[1]
                const bigtext = bigTextRegex.exec(line)?.[1]
                if (when && notification.when === undefined) notification.when = Number(when)
                if (title && notification.title === undefined) notification.title = title
                if (text && notification.text === undefined) notification.text = text
                if (bigtext && notification.bigtext === undefined) notification.bigtext = bigtext
                lineIndex++
            }

            notifications.push(notification)
            index = lineIndex
        }

        return notifications
    },

    blob: (notification: AndroidNotification) => {
        return [notification.title, notification.text, notification.bigtext].filter(Boolean).join(' | ')
    },

    extractAmounts: (text: string) => {
        const amounts: string[] = []
        for (const match of text.matchAll(amountRegex)) {
            const amount = Number(match[1].replace(',', '.'))
            if (Number.isFinite(amount)) amounts.push(amount.toFixed(2))
        }
        return amounts
    },
}
