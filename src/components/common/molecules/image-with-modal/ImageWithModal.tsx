import { ImageIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '@src/components/ui/dialog'
import AesopImage from '@components/common/AesopImage'
import Text from '@components/common/atoms/Text'

function ImageWithModal({ src, alt, caption, showDialog = true }) {
    return (
        <Dialog>
            <div className='w-auto mx-auto h-auto bg-brandaccent-50/50 md:rounded-lg overflow-hidden shadow-xs'>
                <DialogTrigger className='w-full h-full p-0'>
                    <AesopImage
                        width={500}
                        height={300}
                        src={src}
                        alt={alt ?? ''}
                        className='h-fit w-full object-contain md:rounded-t-lg'
                    />
                </DialogTrigger>
                {showDialog && (
                    <DialogContent className='max-w-(--breakpoint-xl) min-h-96'>
                        <AesopImage
                            width={500}
                            height={300}
                            src={src}
                            alt={alt ?? ''}
                            className='h-fit w-full object-contain md:rounded-t-lg'
                        />
                    </DialogContent>
                )}
                <Text className='w-full italic bg-brandaccent-50 text-gray-500 p-2 px-5 flex items-center gap-2 text-sm md:px-2'>
                    <ImageIcon size={16} />
                    {caption || ''}
                </Text>
            </div>
        </Dialog>
    )
}

export default ImageWithModal
