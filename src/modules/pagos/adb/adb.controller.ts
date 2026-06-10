import { execFile } from 'child_process'
import sharp from 'sharp'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

export class AdbController {
    private adbPath: string
    private serial?: string

    constructor(adbPath = 'adb', serial?: string) {
        this.adbPath = adbPath
        this.serial = serial || undefined
    }

    private baseArgs() {
        return this.serial ? ['-s', this.serial] : []
    }

    async run(args: string[], timeout = 30000) {
        const result = await execFileAsync(this.adbPath, [...this.baseArgs(), ...args], {
            timeout,
            encoding: 'utf8',
            maxBuffer: 10 * 1024 * 1024,
        })

        return result.stdout || ''
    }

    async shell(args: string[], timeout = 30000) {
        return await this.run(['shell', ...args], timeout)
    }

    async tap(x: number, y: number) {
        await this.shell(['input', 'tap', String(x), String(y)], 10000)
    }

    async text(value: string) {
        const safeValue = value.replace(/ /g, '%s')
        await this.shell(['input', 'text', safeValue], 10000)
    }

    async keyevent(code: string) {
        await this.shell(['input', 'keyevent', code], 10000)
    }

    async launchApp(packageName: string, activity?: string) {
        if (activity) {
            await this.shell(['am', 'start', '-n', `${packageName}/${activity}`], 15000)
            return
        }

        await this.shell(['monkey', '-p', packageName, '-c', 'android.intent.category.LAUNCHER', '1'], 15000)
    }

    async screencapBase64(crop?: { x: number; y: number; width: number; height: number }) {
        const result = await execFileAsync(this.adbPath, [...this.baseArgs(), 'exec-out', 'screencap', '-p'], {
            timeout: 15000,
            encoding: 'buffer',
            maxBuffer: 20 * 1024 * 1024,
        })

        const image = Buffer.from(result.stdout)
        if (!crop) return image.toString('base64')

        const cropped = await sharp(image)
            .extract({ left: crop.x, top: crop.y, width: crop.width, height: crop.height })
            .png()
            .toBuffer()

        return cropped.toString('base64')
    }

    async deviceOnline() {
        try {
            const output = await this.run(['devices'], 10000)
            return output
                .split('\n')
                .slice(1)
                .some((line) => {
                    const value = line.trim()
                    if (!value || value.includes('offline')) return false
                    if (!value.includes('device')) return false
                    return !this.serial || value.includes(this.serial)
                })
        } catch {
            return false
        }
    }

    async dumpNotifications() {
        return await this.shell(['dumpsys', 'notification', '--noredact'], 30000)
    }
}
