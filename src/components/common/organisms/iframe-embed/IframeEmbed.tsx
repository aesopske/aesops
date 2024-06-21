import { Frame } from 'lucide-react'
import Text from '@components/common/atoms/Text'

function IframeEmbed({ content }) {
    return (
        <div className='bg-brandaccent-50 rounded-md overflow-hidden'>
            <iframe
                src={content?.src}
                height='500px'
                width='100%'
                title={content?.title}
                style={{
                    border: 0,
                    width: '100%',
                    height: '60vh',
                }}
                allow='accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking'
                sandbox='allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts'
            />
            <Text className='p-2 italic text-brandprimary-900/70 flex items-center gap-2 text-sm'>
                <Frame size={16} />
                {content.title}
            </Text>
        </div>
    )
}
export default IframeEmbed
