import { setupAPIClient } from "../Services/Axios"
import { withSSRAuth } from "../Utils/withSSRAuth"

export default function Metrics() {

    return (
        <>
            <h1>Metrics</h1>
        </>
    )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get('/me');

    return {
        props: {}
    }
}, {
    permissions: ['metrics.list'],
    roles: ['administrator']
})