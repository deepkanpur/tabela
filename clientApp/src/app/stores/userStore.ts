import { makeAutoObservable, runInAction } from "mobx";
import { User, UserFormValues } from "../models/user";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../router/Routes";

export default class UserStore {
    user: User | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn() {
        return !!this.user;
    }

    login = async (cred: UserFormValues) => {
        const user = await agent.Account.login(cred);
        console.log(user);
        store.commonStore.setToken(user.token);
        runInAction(() => this.user = user);
        router.navigate('/activities');
        store.modalStore.closeModal();
    }

    register = async (cred: UserFormValues) => {
        const user = await agent.Account.register(cred);
        store.commonStore.setToken(user.token);
        runInAction(() => this.user = user);
        router.navigate('/activities');
        store.modalStore.closeModal();
    }

    logout = () => {        
        store.commonStore.setToken(null);
        this.user = null;
        router.navigate('/');
    }

    getUser = async () => {
        try{
            const user = await agent.Account.current();
            runInAction(() => this.user = user);
        } catch(error){
            console.log(error);
        }
    }

    setImage = (img: string) => {
        if(this.user) this.user.image = img;
    }

    setDisplayName = (name: string) => {
        if(this.user) this.user.displayName = name;
    }
}