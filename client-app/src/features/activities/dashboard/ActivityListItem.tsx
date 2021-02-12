import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon, Item, Segment } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import ActivityStore from '../../../app/stores/activityStore'

interface IProps {
    activity: IActivity;
}

const ActivityListItem: React.FC<IProps> = ({ activity }) => {
    const activityStore = useContext(ActivityStore);
    const { deleteActivity, submitting, target } = activityStore;
    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                <Item>
                    <Item.Image size='tiny' circular src='/assets/user.png' />
                    {/* key={activity.id} */}
                    <Item.Content>
                        <Item.Header as='a'>{activity.title}</Item.Header>
                        <Item.Description>
                            Hosted by Bob
                            {/* <div>{activity.description}</div>
                            <div>{activity.city}, {activity.venue}</div> */}
                        </Item.Description>
                        {/* <Item.Extra>
                            <Label basic content={activity.category} />
                        </Item.Extra> */}
                    </Item.Content>
                </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <Icon name='clock' />{activity.date}
                <Icon name='marker' />{activity.venue}, {activity.city}
            </Segment>
            <Segment secondary>
                Attendees will go here
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button
                    //onClick={() => selectActivity(activity.id)}
                    as={Link} to={`/activities/${activity.id}`}
                    floated='right'
                    content='View'
                    color='blue' />
                <Button
                    name={activity.id}
                    loading={target === activity.id && submitting}
                    onClick={(e) => deleteActivity(e, activity.id)}
                    floated='right'
                    content='Delete'
                    color='red' />
            </Segment>
        </Segment.Group>

    )
}

export default ActivityListItem
