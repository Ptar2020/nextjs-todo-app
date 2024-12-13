// dynamic
import { Metadata } from 'next';

type Props = {
    params: {
        _id: string
    }
}
export const generateMetadata = ({ params }: Props): Metadata => {
    return { title: `${params._id}` }
}


// Static

export const metadata = () => {
    return { title: "My title" }
}