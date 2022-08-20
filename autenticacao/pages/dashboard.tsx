import { useContext } from "react"
import { Can } from "../Component/Can"
import { AuthContext } from "../Context/AuthContext"
import { setupAPIClient } from "../Services/Axios"
import { withSSRAuth } from "../Utils/withSSRAuth"

export default function Dashboard() {
    const { user, signOut } = useContext(AuthContext)


    return (
        <>
            <h1>Dashboard {user?.email}</h1>

            <button onClick={signOut}>Sign out</button>

            <Can permissions={['metrics.list']}>
                <div>Métricas</div>
            </Can>
        </>
    )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get('/me');

    return {
        props: {}
    }
})