import { Frame } from 'lucide-react'

function IframeEmbed({ content }) {
    return (
        <div className='bg-aes-light rounded-md overflow-hidden'>
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
            <p className='p-2 italic text-aes-dark/70 flex items-center gap-2'>
                <Frame size={16} />
                {content.title}
            </p>
        </div>
    )
}
export default IframeEmbed
