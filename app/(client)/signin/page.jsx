import Image from "next/image"

export default function SignIn() {
    return (
        <section className="h-screen w-full flex flex-col justify-center items-center">
            <div>
            <h1 className="mb-5 heading">Gym<span className="blue-span">Lense</span></h1>
            <div className="w-full">
                <button className="sign-in-button flex justify-center gap-2 items-center"><Image src="/apple-logo.svg" height={19} width={19} alt="" />Sign in with Apple</button>
                <button className="sign-in-button flex justify-center gap-2 items-center"><Image src="/google-logo.svg" height={19} width={19} alt="" />Sign in with Google</button>
            </div>
            </div>
        </section>
    )
}