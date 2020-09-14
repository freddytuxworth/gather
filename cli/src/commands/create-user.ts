import {Command, flags} from '@oclif/command'

export default class CreateUser extends Command {
  static description = 'create a new gather user account'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [
    {name: 'uuid', type: 'string'},
    {name: 'password', type: 'string'},
    {name: 'profile', type: 'string'}
  ];

  async run() {
    const {args, flags} = this.parse(CreateUser)

    this.debug("generating new profile key");

    const name = flags.name ?? 'world'
    this.log(`hello ${name} from /home/diffblue/freddy.tuxworth/Desktop/oss/gather/lib-gather/cli/src/commands/create-user.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
