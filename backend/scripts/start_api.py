import argparse
import subprocess


def main():
    parser = argparse.ArgumentParser(description="Start SAM local API")
    parser.add_argument(
        "--profile",
        required=True,
        help="AWS CLI profile (must be provided)",
    )

    args = parser.parse_args()
    cmd = [
        "sam",
        "local",
        "start-api",
        "--docker-network",
        "petrock_nova",
        "--profile",
        args.profile,
    ]

    subprocess.run(cmd, check=True)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("中断されました。")
