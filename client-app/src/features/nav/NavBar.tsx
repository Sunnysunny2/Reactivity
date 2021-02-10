import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext } from 'react'
import { Container, Menu, Button } from 'semantic-ui-react'
import ActivityStore from '../../app/stores/activityStore'


const NavBar: React.FC = () => {
    const activityStore = useContext(ActivityStore);
    return (
        <Fragment>
            <Menu fixed='top' inverted>
                <Container>
                    <Menu.Item header>
                        <img src="/assets/logo.png" alt="logo" style={{ marginRight: '10px' }} />
                    Reactivities
                    </Menu.Item>
                    <Menu.Item name='Activities' />
                    <Menu.Item >
                        <Button onClick={activityStore.openCreateForm} positive content='Create Activity' />
                    </Menu.Item>
                </Container>
            </Menu>
        </Fragment>
    )
}

export default observer(NavBar);