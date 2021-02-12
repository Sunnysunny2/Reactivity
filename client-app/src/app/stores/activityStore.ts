import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../models/activity";
import agent from '../api/agent';
import { makeAutoObservable } from 'mobx';

// 不允许在动作外部修改状态
configure({ enforceActions: 'always' });

class ActivityStore {
    constructor() {
        makeAutoObservable(this);
    }

    @observable activityRegistry = new Map();
    @observable activity: IActivity | null = null;
    @observable loadingInitial = false;
    @observable submitting = false;
    @observable target = '';

    @computed get activitiesByDate() {
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
        // return Array.from(this.activityRegistry.values()).slice().sort(
        //     (a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

    groupActivitiesByDate(activities: IActivity[]) {
        const sortedActivities = activities.sort(
            (a, b) => Date.parse(a.date) - Date.parse(b.date)
        )
        return Object.entries(sortedActivities.reduce((activities, activity) => {
            const date = activity.date.split('T')[0];
            activities[date] = activities[date] ? [...activities[date], activity] : [activity]
            return activities;
        }, {} as { [key: string]: IActivity[] }));
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction(() => {
                activities.forEach((activity) => {
                    activity.date = activity.date.split('.')[0];
                    this.activityRegistry.set(activity.id, activity);
                })
                this.loadingInitial = false;
            })
        } catch (error) {
            runInAction(() => {
                this.loadingInitial = false;
            })
            console.log(error);
        }
    }

    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.activity = activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.detail(id);
                runInAction(() => {
                    this.activity = activity;
                    this.loadingInitial = false;
                })
            } catch (error) {
                console.log(error);
                runInAction(() => {
                    this.loadingInitial = false;
                })
            }
        }
    }

    @action clearActivity = () => {
        this.activity = null;
    }

    getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                //this.activities.push(activity);
                //this.activity = this.activities.find(a => a.id === activity.id);
                // this.editMode = false;
                this.submitting = false;
            })
        } catch (error) {
            runInAction(() => {
                this.submitting = false;
            })
            console.log(error);
        }
    }

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            //this.activityRegistry.delete(activity.id);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
                // this.editMode = false;
                this.submitting = false;
            })
        } catch (error) {
            runInAction(() => {
                this.submitting = false;
            })
            console.log(error);
        }
    }

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                this.submitting = false;
                this.target = '';
            })
        } catch (error) {
            runInAction(() => {
                this.submitting = false;
                this.target = '';
            })
            console.log(error);

        }
    }

    // @observable activities: IActivity[] = [];
    // @observable editMode = false;
    // @action openCreateForm = () => {
    //     this.activity = null;
    //     this.editMode = true;
    // }

    // @action openEditForm = (id: string) => {
    //     this.activity = this.activityRegistry.get(id);
    //     this.editMode = true;
    // }

    // @action cancelSelectedActivity = () => {
    //     this.activity = null;
    // }

    // @action cancelFormOpen = () => {
    //     this.editMode = false;
    // }

    // @action selectActivity = (id: string) => {
    //     //this.selectedActivity = this.activities.find(a => a.id === id);
    //     this.activity = this.activityRegistry.get(id);
    //     // this.editMode = false;
    // }
}

export default createContext(new ActivityStore());