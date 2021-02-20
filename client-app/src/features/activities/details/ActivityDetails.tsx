import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from 'react-router'
import { Grid } from 'semantic-ui-react'
import LoadingComponent from '../../../app/layout/LoadingComponent'
import ActivityStore from '../../../app/stores/activityStore'
import { ActivityDetailedChat } from './ActivityDetailedChat'
import ActivityDetailedHeader from './ActivityDetailedHeader'
import ActivityDetailedInfo from './ActivityDetailedInfo'
import { ActivityDetailedSidebar } from './ActivityDetailedSidebar'

interface DetailParams {
    id: string
}
const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({ match }) => {
    const activityStore = useContext(ActivityStore);
    const { activity, loadActivity, loadingInitial } = activityStore;

    useEffect(() => {
        loadActivity(match.params.id)
    }, [loadActivity, match.params.id]);//set dependency for run once

    if (loadingInitial) return <LoadingComponent content='Loading activity...' />

    if (!activity) return <h2>Activity not found</h2>
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity={activity} />
                <ActivityDetailedInfo activity={activity} />
                <ActivityDetailedChat />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSidebar />
            </Grid.Column>
        </Grid>
        // <Card fluid>
        //     <Image src={`/assets/categoryImages/${activity!.category}.jpg`} wrapped ui={false} />
        //     <Card.Content>
        //         <Card.Header>{activity!.title}</Card.Header>
        //         <Card.Meta>
        //             <span>{activity!.date}</span>
        //         </Card.Meta>
        //         <Card.Description>
        //             {activity!.description}
        //         </Card.Description>
        //     </Card.Content>
        //     <Card.Content extra>
        //         <Button.Group widths={2}>
        //             <Button
        //                 // onClick={() => openEditForm(activity!.id)}
        //                 as={Link} to={`/manage/${activity.id}`}
        //                 basic color='blue'
        //                 content='Edit' />
        //             <Button
        //                 // onClick={cancelSelectedActivity} 
        //                 onClick={() => history.push('/activities')}
        //                 basic color='grey'
        //                 content='Cancel' />
        //         </Button.Group>
        //     </Card.Content>
        // </Card>
    )
}

export default observer(ActivityDetails);
