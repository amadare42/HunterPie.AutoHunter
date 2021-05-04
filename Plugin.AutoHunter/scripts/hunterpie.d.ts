// Generated from HunterPie.Core v1.0.5.13 & Plugin v1.0.0.320

// ---- Types ---
declare type Dictionary<Key, Value> = any;

declare type ReadOnlyDictionary<Key, Value> = Dictionary<Key, Value>;

declare type IReadOnlyCollection<Value> = Iterable<Value> & { readonly [n: number]: Value };

declare type List<Value> = Iterable<Value> & { readonly [n: number]: Value, Count: number };

declare type ClrArray<Value> = Iterable<Value> & { readonly [n: number]: Value, Length: number };

declare type IEnumerable<Value> = Iterable<Value> & { readonly [n: number]: Value };

declare type Enum<Value extends string> = { ToString(): Value };

declare type EventObj<Args> = { connect(cb: (sender: any, args: Args) => void): EventConnection;  };

declare type EventConnection = { disconnect(): void; };

declare type EventArgs = any;

declare type EventRegistration = { unregister(): void; };

declare type WorldEventArgsType = {
    // Represents the world time
    WorldTime: number,
    // Representation of the day time
    DayTime: DayTimeType,
};

declare type DayTimeType = Enum<"Morning" | "Afternoon" | "Evening" | "Night">;

declare type PlayerAilmentEventArgsType = {
    AilmentTimer: number,
    AilmentMaxTimer: number,
    AilmentType: PlayerAilmentType,
};

declare type PlayerAilmentType = Enum<"None" | "Paralysis" | "Stun" | "Sleep">;

declare type JobEventArgsType = {
    // Current hit counter for safi'jiiva regen. proc
    SafijiivaRegenCounter: number,
    // Total hits you need for the buff to proc
    SafijiivaMaxHits: number,
    // Whether the weapon is sheathed or not
    IsWeaponSheathed: boolean,
};

declare type SharpnessEventArgsType = {
    // Current sharpness
    Sharpness: number,
    // Maximum sharpness available
    MaximumSharpness: number,
    // Sharpness level
    Level: SharpnessLevelType,
    // Maximum Sharpness Level
    MaxLevel: SharpnessLevelType,
    // Maximum sharpness for that level
    Max: number,
    // Minimum sharpness for that level
    Min: number,
    // Array with all sharpness levels values
    SharpnessProgress: ClrArray<number>,
};

declare type SharpnessLevelType = Enum<"Red" | "Orange" | "Yellow" | "Green" | "Blue" | "White" | "Purple" | "Unk0" | "Unk1">;

declare type MonsterSpawnEventArgsType = {
    // Monster name
    Name: string,
    // Monster em ID
    ID: string,
    // Monster crown icon name
    Crown: string,
    // Monster current health
    Health: number,
    // Monster maximum health
    MaxHealth: number,
    // Whether this monster is the target or not
    IsTarget: boolean,
    // Monster weaknesses. 
    // Key: Weakness icon name
    // Value: Weakness level
    Weaknesses: Dictionary<string, number>,
};

declare type MonsterUpdateEventArgsType = {
    // Monster current health
    Health: number,
    // Monster maximum health
    MaxHealth: number,
    // Monster current stamina
    Stamina: number,
    // Monster maximum stamina
    MaxStamina: number,
    // Monster enrage timer
    Enrage: number,
    // Monster action name
    Action: string,
    // Monster raw action name
    RawAction: string,
    // Monster action id
    ActionId: number,
};

declare type GameType = {
    // Player object
    Player: PlayerType,
    // First monster in the map
    FirstMonster: MonsterType,
    // Second monster in the map
    SecondMonster: MonsterType,
    // Third monster in the map
    ThirdMonster: MonsterType,
    // Current monster target by the local player
    HuntedMonster: MonsterType,
    Time: any /* DateTime */ | null,
    // Whether the game scanner is currently active
    IsActive: boolean,
    // Current world time (e.g: 10.3 represents 10:18 AM)
    WorldTime: number,
    // Current world DayTime
    DayTime: DayTimeType,
    // Array with the FirstMonster, SecondMonster and ThirdMonster
    Monsters: ClrArray<MonsterType>,
    // Dispatched everytime the World time changes
    OnWorldTimeUpdate: EventObj<WorldEventArgsType>,
    // Dispatched everytime the World DayTime changes
    OnWorldDayTimeUpdate: EventObj<WorldEventArgsType>,
    // Dispatched every 10 seconds
    OnClockChange: EventObj<EventArgs>,
};

declare type PlayerType = {
    // Current player save address
    PlayerAddress: any /* Int64 */,
    // Player Name
    Name: string,
    // Player High rank
    Level: number,
    // Player master rank
    MasterRank: number,
    // Player playtime in seconds
    PlayTime: number,
    // Whether this player is logged on or not
    IsLoggedOn: boolean,
    // Player Weapon Id
    WeaponID: number,
    // Player weapon name, in HunterPie's current localization
    WeaponName: string,
    // Player weapon data memory address
    ClassAddress: any /* Int64 */,
    // Current Zone Id
    ZoneID: number,
    // Current zone name, it uses HunterPie's localization
    ZoneName: string,
    // Last Zone Id
    LastZoneID: number,
    // Whether the player is in a peace zone or not. A zone is considered a peace zone when the player cannot use weapons in there.
    InPeaceZone: boolean,
    // Whether the player is in a zone where the Harvest Box can be accessed
    InHarvestZone: boolean,
    // Current Session Id
    SessionID: string,
    // Current Steam Session Id
    SteamSession: any /* Int64 */,
    // Client's account steam Id
    SteamID: any /* Int64 */,
    // Player action id
    ActionId: number,
    // Player current ailment duration timer
    AilmentTimer: number,
    // Player current ailment max duration
    MaxAilmentTimer: number,
    // Player current active ailment, if there's any
    AilmentType: PlayerAilmentType,
    // Whether the player has drank hot drink or not while in snow stages
    HasHotDrink: boolean,
    // Gets the raw name for the player current action reference name
    PlayerActionRef: string,
    // Pointer to the current weapon
    CurrentWeapon: JobType,
    LastWeapon: JobType,
    // Player gear skill list
    Skills: ClrArray<sPlayerSkillType>,
    // Player health component
    Health: HealthComponentType,
    // Player stamina component
    Stamina: StaminaComponentType,
    // Food data
    FoodData: sFoodDataType,
    // Player position
    Position: Vector3Type,
    // Player item pouch
    Inventory: InventoryType,
    // Player item box
    ItemBox: ItemBoxType,
    // Player current party
    PlayerParty: PartyType,
    // Player harvest box
    Harvest: HarvestBoxType,
    // Argosy, Tailraiders and Steam Fuel
    Activity: ActivitiesType,
    // Current primary mantle
    PrimaryMantle: MantleType,
    // Current secondary mantle
    SecondaryMantle: MantleType,
    // Player abnormalities
    Abnormalities: AbnormalitiesType,
    Greatsword: GreatswordType,
    SwordAndShield: SwordAndShieldType,
    DualBlades: DualBladesType,
    Longsword: LongswordType,
    Hammer: HammerType,
    HuntingHorn: HuntingHornType,
    Lance: LanceType,
    GunLance: GunLanceType,
    SwitchAxe: SwitchAxeType,
    ChargeBlade: ChargeBladeType,
    InsectGlaive: InsectGlaiveType,
    Bow: BowType,
    LightBowgun: LightBowgunType,
    HeavyBowgun: HeavyBowgunType,
    GetPlayerGear(): GearType,
    GetDecorationsFromStorage(): ClrArray<sItemType>,
    GetGearFromStorage(): ClrArray<sGearType>,
    ChangeLastZone(): void,
    OnLevelChange: EventObj<EventArgs>,
    OnWeaponChange: EventObj<EventArgs>,
    OnSessionChange: EventObj<EventArgs>,
    OnClassChange: EventObj<EventArgs>,
    OnActionChange: EventObj<EventArgs>,
    OnCharacterLogin: EventObj<EventArgs>,
    OnCharacterLogout: EventObj<EventArgs>,
    OnZoneChange: EventObj<EventArgs>,
    OnPeaceZoneEnter: EventObj<EventArgs>,
    OnVillageEnter: EventObj<EventArgs>,
    OnPeaceZoneLeave: EventObj<EventArgs>,
    OnVillageLeave: EventObj<EventArgs>,
    OnHotDrinkStateChange: EventObj<EventArgs>,
    OnAilmentUpdate: EventObj<PlayerAilmentEventArgsType>,
    OnPlayerScanFinished: EventObj<EventArgs>,
};

declare type JobType = {
    Type: ClassesType,
    SafijiivaRegenCounter: number,
    SafijiivaMaxHits: number,
    IsWeaponSheated: boolean,
    IsMelee: boolean,
    Sharpness: number,
    MaximumSharpness: number,
    SharpnessLevel: SharpnessLevelType,
    MaxSharpnessLevel: SharpnessLevelType,
    Sharpnesses: ClrArray<number>,
    SharpnessMax: number,
    SharpnessMin: number,
    Dispatch(e: any /* delegate */): void,
    Dispatch(e: any /* delegate */): void,
    OnSafijiivaCounterUpdate: EventObj<JobEventArgsType>,
    OnWeaponSheathStateChange: EventObj<JobEventArgsType>,
    OnSharpnessChange: EventObj<SharpnessEventArgsType>,
    OnSharpnessLevelChange: EventObj<SharpnessEventArgsType>,
};

declare type ClassesType = Enum<"Greatsword" | "SwordAndShield" | "DualBlades" | "LongSword" | "Hammer" | "HuntingHorn" | "Lance" | "GunLance" | "SwitchAxe" | "ChargeBlade" | "InsectGlaive" | "Bow" | "HeavyBowgun" | "LightBowgun" | "None">;

declare type sPlayerSkillType = {
    unk0: any /* Int64 */,
    LevelGear: number,
    LevelMantle: number,
    unk1: number,
    unk2: number,
    unk3: number,
    unk4: number,
};

declare type HealthComponentType = {
    // Player health
    Health: number,
    // Player maximum health
    MaxHealth: number,
    // The red gauge in the player health bar
    RedHealth: number,
    // The heal gauge in the player health bar
    HealHealth: sHealingDataType,
    sGuiRawData: sGuiHealthType,
    MaxPossibleHealth: number,
    IsHealthExtVisible: boolean,
    SelectedItemId: number,
    // Dispatched whenever the Health value changes
    OnHealthUpdate: EventObj<PlayerHealthEventArgsType>,
    // Dispatched whenever the maximum health changes
    OnMaxHealthUpdate: EventObj<PlayerHealthEventArgsType>,
    // Dispatched whenever the red health value changes
    OnRedHealthUpdate: EventObj<PlayerHealthEventArgsType>,
    // Dispatched whenever the healing data changes
    OnHealHealth: EventObj<PlayerHealthEventArgsType>,
    // Dispatched whenever the player is holding an item that can increase
    // the player maximum health
    OnHealthExtStateUpdate: EventObj<PlayerHealthEventArgsType>,
};

declare type sHealingDataType = {
    Ref1: any /* UInt64 */,
    Ref2: any /* UInt64 */,
    CurrentHeal: number,
    OldMaxHeal: number,
    MaxHeal: number,
    CurrentHealSpeed: number,
    MaxHealSpeed: number,
    unk: number,
    unk1: number,
    Stage: number,
    unk2: number,
    unk3: number,
    unk4: number,
    unk5: number,
};

declare type sGuiHealthType = {
    cRef: any /* Int64 */,
    unk0: number,
    unk1: number,
    unk2: number,
    unk3: number,
    Health: number,
    unk4: number,
    unkPtr: any /* Int64 */,
    IsHoldingItemDisplay: number,
    unk5: number,
    unk7: number,
    unk8: number,
    unk9: number,
    IsHealthExtVisible: number,
    unk10: number,
    unk11: number,
    MaxPossibleHealth: number,
    MaxHealth: number,
    MaxHealth2: number,
    ItemIdSelected: number,
    unk12: number,
    unkPtr2: any /* Int64 */,
    HealthExtShowTimer: number,
    MaxHealthExtShowTimer: number,
};

declare type PlayerHealthEventArgsType = {
    // Player current health
    Health: number,
    // Player maximum health
    MaxHealth: number,
    // Healing data
    HealingData: sHealingDataType,
    // Red health gauge
    RedHealth: number,
    // Maximum health player can have
    MaxPossibleHealth: number,
    // raw HUD data
    sGuiRawData: sGuiHealthType,
    // Whether the player is holding an item that can increase their maximum health
    IsHealthExtVisible: boolean,
    // Currently selected item
    SelectedItemId: number,
};

declare type StaminaComponentType = {
    // Player stamina
    Stamina: number,
    // Player maximum stamina
    MaxStamina: number,
    sGuiRawData: sGuiStaminaType,
    MaxPossibleStamina: number,
    IsStaminaExtVisible: boolean,
    SelectedItemId: number,
    OnStaminaUpdate: EventObj<PlayerStaminaEventArgsType>,
    OnMaxStaminaUpdate: EventObj<PlayerStaminaEventArgsType>,
    OnStaminaExtStateUpdate: EventObj<PlayerStaminaEventArgsType>,
};

declare type sGuiStaminaType = {
    cRef: any /* Int64 */,
    unk0: number,
    unk1: number,
    unk2: number,
    unk3: number,
    unkPtrArray: ClrArray<any /* Int64 */>,
    unk4: number,
    stamina: number,
    unkPtr1: any /* Int64 */,
    unk5: number,
    unk6: number,
    unk7: number,
    unk8: number,
    maxPossibleStamina: number,
    unk9: number,
    maxStamina: number,
    selectedItemId: number,
    unkPtr2: any /* Int64 */,
    CurrentExtTimer: number,
    MaxExtTimer: number,
    unk10: number,
    unk11: number,
    unk12: number,
    unk13: number,
    unk14: number,
    isExtGaugeVisible: number,
};

declare type PlayerStaminaEventArgsType = {
    // Player current stamina
    Stamina: number,
    // Player maximum stamina
    MaxStamina: number,
    MaxPossibleStamina: number,
    sGuiRawData: sGuiStaminaType,
    IsStaminaExtVisible: boolean,
    SelectedItemId: number,
};

declare type sFoodDataType = {
    cRef: any /* UInt64 */,
    HealthType: number,
    StaminaType: number,
    AttackType: FoodBuffTypeType,
    DefenseType: FoodBuffTypeType,
    ElementalType: FoodBuffTypeType,
    Skills: ClrArray<FoodSkillsType>,
};

declare type FoodBuffTypeType = Enum<"None" | "S" | "M" | "L">;

declare type FoodSkillsType = Enum<"FelynePolisher" | "FelyneRider" | "FelyneHeroics" | "FelyneCarverHi" | "FelyneCarverLo" | "FelyneMedic" | "FelyneBlackBelt" | "FelynePyro" | "FelyneSpecialist" | "FelyneDefenderHi" | "FelyneDefenderLo" | "FelyneHarvester" | "FelyneSharpshooter" | "LuckyCat" | "FelyneDeflector" | "FelyneEscapeArtist" | "FelyneSprinter" | "Felynebacker" | "FelyneWeakener" | "FelyneExchanger" | "FelyneRiserHi" | "FelyneRiserLo" | "FelyneTemper" | "FelyneCliffhanger" | "FelyneGripper" | "FelyneIronCarver" | "FelyneLander" | "FelyneBulldozer" | "FelyneFoodie" | "FelyneSlugger" | "FelyneFatCat" | "FelyneBombardier" | "FelyneMoxie" | "FelyneDungmaster" | "FelyneGroomer" | "FelyneFurCoating" | "FelyneAcrobat" | "FelyneGamechanger" | "FelyneTrainer" | "FelyneBooster" | "FelyneFeet" | "FelyneFisher" | "CoolCat" | "FelyneInsurance" | "FelyneProvoker" | "FelynePartingGift" | "FelyneResearcher" | "FelyneWeathercat" | "FelyneCleats" | "FelyneTailor" | "FelyneSafeguard" | "FelyneGardener" | "FelyneScavenger" | "FelyneZoomaster" | "FelyneBiologist" | "FelyneMacrozoologist" | "FelyneMicrozoologist" | "None">;

declare type Vector3Type = {
    // X coordinate in a 3D space
    X: number,
    // Y coordinate in a 3D space
    Y: number,
    // Z coordinate in a 3D space
    Z: number,
    // Updates the current Vector values
    Update(vec: sVector3Type): void,
    // Calculates the distance between two Vector3
    Distance(other: Vector3Type): number,
};

declare type sVector3Type = {
    X: number,
    Y: number,
    Z: number,
};

declare type InventoryType = {
    Items: ReadOnlyDictionary<number, sItemType>,
    Ammo: ReadOnlyDictionary<number, sItemType>,
    // Finds consumable/items in the player's item pouch
    FindItem(id: number): sItemType | null,
    // Find multiple items in the items pouch
    FindItems(ids: IReadOnlyCollection<number>): ClrArray<sItemType>,
    // Find multiple ammos in the ammo pouch
    FindAmmos(ids: IReadOnlyCollection<number>): ClrArray<sItemType>,
    // Find multiple items in both the ammo and items pouch
    FindItemsAndAmmos(ids: IReadOnlyCollection<number>): ClrArray<sItemType>,
    // Finds an ammo with the specified id in the player's ammo pouch
    FindAmmo(id: number): sItemType | null,
    OnInventoryUpdate: EventObj<InventoryUpdatedEventArgsType>,
};

declare type sItemType = {
    unk0: any /* Int64 */,
    ItemId: number,
    Amount: number,
};

declare type InventoryUpdatedEventArgsType = {
    Items: ReadOnlyDictionary<number, sItemType>,
    Ammos: ReadOnlyDictionary<number, sItemType>,
};

declare type ItemBoxType = {
    Consumables: ReadOnlyDictionary<number, number>,
    Ammo: ReadOnlyDictionary<number, number>,
    Materials: ReadOnlyDictionary<number, number>,
    Decorations: ReadOnlyDictionary<number, number>,
    // Find multiple items in all 4 tabs of the box
    FindItemsInBox(ids: IReadOnlyCollection<number>): Dictionary<number, number>,
    OnItemBoxUpdate: EventObj<ItemBoxUpdatedEventArgsType>,
};

declare type ItemBoxUpdatedEventArgsType = {
    consumables: ReadOnlyDictionary<number, number>,
    ammo: ReadOnlyDictionary<number, number>,
    materials: ReadOnlyDictionary<number, number>,
    decorations: ReadOnlyDictionary<number, number>,
};

declare type PartyType = {
    Player: MemberType,
    Epoch: any /* TimeSpan */,
    PartyHash: string,
    TotalDamage: number,
    LobbySize: number,
    IsLocalHost: boolean,
    Item: MemberType,
    Size: number,
    MaxSize: number,
    Members: List<MemberType>,
    IsExpedition: boolean,
    TimeDifference: any /* TimeSpan */,
    ShowDPS: boolean,
    MaxLobbySize: number,
    AddMember(pMember: MemberType): void,
    Clear(): void,
    OnTotalDamageChange: EventObj<EventArgs>,
    OnTimerReset: EventObj<EventArgs>,
};

declare type MemberType = {
    Name: string,
    DamagePercentage: number,
    Damage: number,
    Weapon: number,
    WeaponIconName: string,
    IsPartyLeader: boolean,
    IsInParty: boolean,
    HR: number,
    MR: number,
    IsMe: boolean,
    SetPlayerInfo(info: MemberInfoType, ApplyDamage: boolean): void,
    OnDamageChange: EventObj<PartyMemberEventArgsType>,
    OnWeaponChange: EventObj<PartyMemberEventArgsType>,
    OnSpawn: EventObj<PartyMemberEventArgsType>,
    OnDespawn: EventObj<PartyMemberEventArgsType>,
};

declare type MemberInfoType = {
    Name: string,
    HR: number,
    MR: number,
    WeaponId: number,
    IsLocalPlayer: boolean,
    IsLeader: boolean,
    Damage: number,
    DamagePercentage: number,
};

declare type PartyMemberEventArgsType = {
    // Party member name.
    Name: string,
    // Party member damage.
    Damage: number,
    // Party member weapon name.
    Weapon: string,
    // Whether this member is in party or not.
    IsInParty: boolean,
};

declare type HarvestBoxType = {
    Counter: number,
    Box: ClrArray<FertilizerType>,
    Max: number,
    OnCounterChange: EventObj<HarvestBoxEventArgsType>,
};

declare type FertilizerType = {
    Name: string,
    ID: number,
    Amount: number,
    OnFertilizerChange: EventObj<FertilizerEventArgsType>,
    OnAmountUpdate: EventObj<FertilizerEventArgsType>,
};

declare type FertilizerEventArgsType = {
    // Fertilizer Id
    ID: number,
    // Fertilizer name
    Name: string,
    // Fertilizer amount
    Amount: number,
};

declare type HarvestBoxEventArgsType = {
    // Amount of items in the Harvest Box
    Counter: number,
    // Maximum amount of items the Harvest Box can hold
    Max: number,
};

declare type ActivitiesType = {
    NaturalFuel: number,
    StoredFuel: number,
    ArgosyDaysLeft: number,
    TailraidersDaysLeft: number,
    TailraidersMaxQuest: number,
    SetSteamFuelInfo(NaturalFuel: number, StoredFuel: number): void,
    SetArgosyInfo(Days: number, IsInTown: boolean): void,
    SetTailraidersInfo(Days: number, IsDeployed: boolean): void,
    OnNaturalSteamChange: EventObj<SteamFuelEventArgsType>,
    OnStoredSteamChange: EventObj<SteamFuelEventArgsType>,
    OnArgosyDaysChange: EventObj<DaysLeftEventArgsType>,
    OnTailraidersDaysChange: EventObj<DaysLeftEventArgsType>,
};

declare type SteamFuelEventArgsType = {
    // Available fuel
    Available: number,
    // Maximum fuel
    Max: number,
};

declare type DaysLeftEventArgsType = {
    // This depends on Modifier and on the event.
    // OnArgosyDaysChange - If Modifier is true, this indicates the days left until argosy goes away from town.
    // If it's false, it indicates how many days until Argosy comes back.
    Days: number,
    // Depends on what event triggered it.
    // OnArgosyDaysChange - Whether Argosy is in town or not.
    // OnTailraidersDaysChange - If Tailraiders are deployed or not.
    Modifier: boolean,
};

declare type MantleType = {
    Name: string,
    ID: number,
    Cooldown: number,
    Timer: number,
    staticCooldown: number,
    staticTimer: number,
    SetCooldown(cd: number, staticCd: number): void,
    SetTimer(Timer: number, staticTimer: number): void,
    SetID(newID: number): void,
    OnMantleCooldownUpdate: EventObj<MantleEventArgsType>,
    OnMantleTimerUpdate: EventObj<MantleEventArgsType>,
    OnMantleChange: EventObj<MantleEventArgsType>,
};

declare type MantleEventArgsType = {
    // Mantle name
    Name: string,
    // Mantle game Id
    Id: number,
    // Mantle duration timer
    Timer: number,
    // Mantle maximum duration timer
    MaxTimer: number,
    // Mantle cooldown timer
    Cooldown: number,
    // Mantle maximum cooldown timer
    MaxCooldown: number,
};

declare type AbnormalitiesType = {
    Item: AbnormalityType,
    Add(AbnormId: string, Abnorm: AbnormalityType): void,
    Remove(AbnormId: string): void,
    ClearAbnormalities(): void,
    OnNewAbnormality: EventObj<AbnormalityEventArgsType>,
    OnAbnormalityRemove: EventObj<AbnormalityEventArgsType>,
};

declare type AbnormalityType = {
    Name: string,
    Icon: string,
    Type: AbnormalityTypeType,
    Id: number,
    Stack: number,
    InternalID: string,
    IsInfinite: boolean,
    Duration: number,
    MaxDuration: number,
    DurationPercentage: number,
    IsDebuff: boolean,
    IsPercentageBuff: boolean,
    MaxTimer: number,
    UpdateAbnormalityInfo(newDuration: number, newStack: number): void,
    ResetDuration(): void,
    OnAbnormalityStart: EventObj<AbnormalityEventArgsType>,
    OnStackChange: EventObj<AbnormalityEventArgsType>,
    OnAbnormalityUpdate: EventObj<AbnormalityEventArgsType>,
    OnAbnormalityEnd: EventObj<AbnormalityEventArgsType>,
};

declare type AbnormalityTypeType = Enum<"HuntingHorn" | "Palico" | "Debuff" | "Misc" | "Gear">;

declare type AbnormalityEventArgsType = {
    // The abnormality object
    Abnormality: AbnormalityType,
};

declare type GreatswordType = {
    SafijiivaMaxHits: number,
    Type: ClassesType,
    IsMelee: boolean,
    ChargeLevel: number,
    IsOvercharged: boolean,
    ChargeTimer: number,
    SafijiivaRegenCounter: number,
    IsWeaponSheated: boolean,
    Sharpness: number,
    MaximumSharpness: number,
    SharpnessLevel: SharpnessLevelType,
    MaxSharpnessLevel: SharpnessLevelType,
    Sharpnesses: ClrArray<number>,
    SharpnessMax: number,
    SharpnessMin: number,
    Dispatch(e: any /* delegate */): void,
    Dispatch(e: any /* delegate */): void,
    OnChargeLevelChange: EventObj<GreatswordEventArgsType>,
    OnChargeTimerChange: EventObj<GreatswordEventArgsType>,
    OnSafijiivaCounterUpdate: EventObj<JobEventArgsType>,
    OnWeaponSheathStateChange: EventObj<JobEventArgsType>,
    OnSharpnessChange: EventObj<SharpnessEventArgsType>,
    OnSharpnessLevelChange: EventObj<SharpnessEventArgsType>,
};

declare type GreatswordEventArgsType = {
    ChargeLevel: number,
    ChargeTimer: number,
    IsOvercharged: boolean,
};

declare type SwordAndShieldType = {
    SafijiivaMaxHits: number,
    Type: ClassesType,
    IsMelee: boolean,
    SafijiivaRegenCounter: number,
    IsWeaponSheated: boolean,
    Sharpness: number,
    MaximumSharpness: number,
    SharpnessLevel: SharpnessLevelType,
    MaxSharpnessLevel: SharpnessLevelType,
    Sharpnesses: ClrArray<number>,
    SharpnessMax: number,
    SharpnessMin: number,
    Dispatch(e: any /* delegate */): void,
    Dispatch(e: any /* delegate */): void,
    OnSafijiivaCounterUpdate: EventObj<JobEventArgsType>,
    OnWeaponSheathStateChange: EventObj<JobEventArgsType>,
    OnSharpnessChange: EventObj<SharpnessEventArgsType>,
    OnSharpnessLevelChange: EventObj<SharpnessEventArgsType>,
};

declare type DualBladesType = {
    SafijiivaMaxHits: number,
    Type: ClassesType,
    IsMelee: boolean,
    InDemonMode: boolean,
    IsReducing: boolean,
    DemonGauge: number,
    SafijiivaRegenCounter: number,
    IsWeaponSheated: boolean,
    Sharpness: number,
    MaximumSharpness: number,
    SharpnessLevel: SharpnessLevelType,
    MaxSharpnessLevel: SharpnessLevelType,
    Sharpnesses: ClrArray<number>,
    SharpnessMax: number,
    SharpnessMin: number,
    Dispatch(e: any /* delegate */): void,
    Dispatch(e: any /* delegate */): void,
    OnDemonModeToggle: EventObj<DualBladesEventArgsType>,
    OnDemonGaugeChange: EventObj<DualBladesEventArgsType>,
    OnDemonGaugeReduce: EventObj<DualBladesEventArgsType>,
    OnSafijiivaCounterUpdate: EventObj<JobEventArgsType>,
    OnWeaponSheathStateChange: EventObj<JobEventArgsType>,
    OnSharpnessChange: EventObj<SharpnessEventArgsType>,
    OnSharpnessLevelChange: EventObj<SharpnessEventArgsType>,
};

declare type DualBladesEventArgsType = {
    InDemonMode: boolean,
    IsReducing: boolean,
    DemonGauge: number,
};

declare type LongswordType = {
    SafijiivaMaxHits: number,
    Type: ClassesType,
    IsMelee: boolean,
    InnerGauge: number,
    ChargeLevel: number,
    OuterGauge: number,
    HelmBreakerBlink: number,
    IaiSlashBlink: number,
    SafijiivaRegenCounter: number,
    IsWeaponSheated: boolean,
    Sharpness: number,
    MaximumSharpness: number,
    SharpnessLevel: SharpnessLevelType,
    MaxSharpnessLevel: SharpnessLevelType,
    Sharpnesses: ClrArray<number>,
    SharpnessMax: number,
    SharpnessMin: number,
    Dispatch(e: any /* delegate */): void,
    Dispatch(e: any /* delegate */): void,
    OnInnerGaugeChange: EventObj<LongswordEventArgsType>,
    OnChargeLevelChange: EventObj<LongswordEventArgsType>,
    OnOuterGaugeChange: EventObj<LongswordEventArgsType>,
    OnSpiritGaugeBlinkDurationUpdate: EventObj<LongswordEventArgsType>,
    OnSafijiivaCounterUpdate: EventObj<JobEventArgsType>,
    OnWeaponSheathStateChange: EventObj<JobEventArgsType>,
    OnSharpnessChange: EventObj<SharpnessEventArgsType>,
    OnSharpnessLevelChange: EventObj<SharpnessEventArgsType>,
};

declare type LongswordEventArgsType = {
    InnerGauge: number,
    ChargeLevel: number,
    OuterGauge: number,
    HelmBreakerBlink: number,
    IaiSlashBlink: number,
};

declare type HammerType = {
    SafijiivaMaxHits: number,
    Type: ClassesType,
    IsMelee: boolean,
    IsPowerCharged: boolean,
    ChargeLevel: number,
    ChargeProgress: number,
    SafijiivaRegenCounter: number,
    IsWeaponSheated: boolean,
    Sharpness: number,
    MaximumSharpness: number,
    SharpnessLevel: SharpnessLevelType,
    MaxSharpnessLevel: SharpnessLevelType,
    Sharpnesses: ClrArray<number>,
    SharpnessMax: number,
    SharpnessMin: number,
    Dispatch(e: any /* delegate */): void,
    Dispatch(e: any /* delegate */): void,
    OnPowerChargeStateChange: EventObj<HammerEventArgsType>,
    OnChargeLevelChange: EventObj<HammerEventArgsType>,
    OnChargeProgressUpdate: EventObj<HammerEventArgsType>,
    OnSafijiivaCounterUpdate: EventObj<JobEventArgsType>,
    OnWeaponSheathStateChange: EventObj<JobEventArgsType>,
    OnSharpnessChange: EventObj<SharpnessEventArgsType>,
    OnSharpnessLevelChange: EventObj<SharpnessEventArgsType>,
};

declare type HammerEventArgsType = {
    IsPowerCharged: boolean,
    ChargeLevel: number,
    ChargeProgress: number,
};

declare type HuntingHornType = {
    SafijiivaMaxHits: number,
    Type: ClassesType,
    IsMelee: boolean,
    Songs: ClrArray<sHuntingHornSongType>,
    SongCandidates: ClrArray<sHuntingHornSongType>,
    Notes: ClrArray<number>,
    RawNotes: ClrArray<number>,
    NotesQueued: any /* Int64 */,
    FirstNoteIndex: any /* Int64 */,
    SongQueue: ClrArray<number>,
    RawSongQueue: ClrArray<number>,
    SongsQueued: any /* Int64 */,
    LastSongIndex: any /* Int64 */,
    SongIndexesQueue: ClrArray<number>,
    RawSongIndexesQueue: ClrArray<number>,
    SongIndexesQueued: any /* Int64 */,
    SongIndexesFirstIndex: any /* Int64 */,
    SongIdsQueue: ClrArray<number>,
    RawSongIdsQueue: ClrArray<number>,
    SongIdFirstIndex: any /* Int64 */,
    PlayStartAt: number,
    PlayLastAt: any /* Int64 */,
    PlayCurrentAt: any /* Int64 */,
    IsCastingBuffs: boolean,
    IsDoubleCastingBuffs: boolean,
    IsCastingInterrupted: boolean,
    FirstNoteColor: NoteColorIdType,
    SecondNoteColor: NoteColorIdType,
    ThirdNoteColor: NoteColorIdType,
    SafijiivaRegenCounter: number,
    IsWeaponSheated: boolean,
    Sharpness: number,
    MaximumSharpness: number,
    SharpnessLevel: SharpnessLevelType,
    MaxSharpnessLevel: SharpnessLevelType,
    Sharpnesses: ClrArray<number>,
    SharpnessMax: number,
    SharpnessMin: number,
    UpdateInformation(mechanics: sHuntingHornMechanicsType, availableSongs: ClrArray<sHuntingHornSongType>, playerActionId: number): void,
    Dispatch(e: any /* delegate */): void,
    Dispatch(e: any /* delegate */): void,
    OnNoteColorUpdate: EventObj<HuntingHornEventArgsType>,
    OnNoteQueueUpdate: EventObj<HuntingHornNoteEventArgsType>,
    OnSongQueueUpdate: EventObj<HuntingHornSongEventArgsType>,
    OnSongsCast: EventObj<HuntingHornSongCastEventArgsType>,
    OnSafijiivaCounterUpdate: EventObj<JobEventArgsType>,
    OnWeaponSheathStateChange: EventObj<JobEventArgsType>,
    OnSharpnessChange: EventObj<SharpnessEventArgsType>,
    OnSharpnessLevelChange: EventObj<SharpnessEventArgsType>,
};

declare type sHuntingHornSongType = {
    Id: number,
    unkn1: number,
    NotesLength: number,
    unkn2: number,
    BuffId: number,
    Notes: ClrArray<number>,
};

declare type NoteColorIdType = Enum<"Purple" | "Red" | "Orange" | "Yellow" | "Green" | "Blue" | "LightBlue" | "White" | "None">;

declare type sHuntingHornMechanicsType = {
    Notes: ClrArray<number>,
    unkn0: number,
    FirstNoteIndex: any /* Int64 */,
    Notes_Length: any /* Int64 */,
    Songs: ClrArray<number>,
    unkn1: number,
    LastSongIndex: any /* Int64 */,
    Songs_Length: any /* Int64 */,
    SongIndexes: ClrArray<number>,
    unkn2: number,
    SongIndexFirstIndex: any /* Int64 */,
    SongIndexes_Length: any /* Int64 */,
    SongIds: ClrArray<number>,
    unkn3: number,
    SongIdFirstIndex: any /* Int64 */,
    PlayCurrentAt: any /* Int64 */,
    PlayStartAt: number,
    unk0: number,
    unk1: number,
    unk2: number,
    unkn4: number,
    unkn5: number,
    unkn6: number,
    unkn7: number,
    FirstNote: NoteColorIdType,
    SecondNote: NoteColorIdType,
    ThirdNote: NoteColorIdType,
};

declare type HuntingHornEventArgsType = {
    // Available songs for this Hunting Horn
    Songs: ClrArray<sHuntingHornSongType>,
    // First note color
    FirstNoteColor: NoteColorIdType,
    // Second note color
    SecondNoteColor: NoteColorIdType,
    // Third note color
    ThirdNoteColor: NoteColorIdType,
};

declare type HuntingHornNoteEventArgsType = {
    // The last 4 notes the player has played, unorganized and in the same order as they appear in memory.
    RawNotes: ClrArray<number>,
    // The last 4 notes the player has played, this is organized in the same order as they appear in the HUD
    Notes: ClrArray<number>,
    // The index of the first note, this is required if you're using the RawNotes.
    FirstNoteIndex: any /* Int64 */,
    // The amount of valid notes currently in RawNotes array.
    NotesQueued: any /* Int64 */,
    // Possible songs that can be played with the current Notes
    Candidates: ClrArray<sHuntingHornSongType>,
};

declare type HuntingHornSongEventArgsType = {
    // Available Hunting Horn songs
    Songs: ClrArray<sHuntingHornSongType>,
    // Current to-be-played list of songs,
    // their values are their buff Ids.
    //             
    // This array is organized based on the 
    SongQueue: ClrArray<number>,
    // Same as SongQueue, but it's in the same order as they appear in memory.
    RawSongQueue: ClrArray<number>,
    // Number of songs in the SongQueue
    SongsQueued: any /* Int64 */,
    // Index of the last song added to the queue.
    LastSongIndex: any /* Int64 */,
    // Same as SongQueue, however, the values are indexes pointing to the song in the
    // Songs.
    SongIndexesQueue: ClrArray<number>,
    // Same as SongIndexesQueue, but in the order they appear in memory.
    RawSongIndexesQueue: ClrArray<number>,
    // Number of songs queued in the SongIndexesQueue
    SongIndexesQueued: any /* Int64 */,
    // Index of the first song in the RawSongIndexesQueue
    SongIndexesFirstIndex: any /* Int64 */,
    // Whether the player is casting buffs based on their player Action Id
    IsCastingSongs: boolean,
    // Whether the song cast was interrupted by either a monster hitting the player
    IsCastingInterrupted: boolean,
};

declare type HuntingHornSongCastEventArgsType = {
    // Current casted songs
    SongsIdsQueue: ClrArray<number>,
    // Unordered version of SongsIdsQueue
    RawSongsIdsQueue: ClrArray<number>,
    // First index of RawSongsIdsQueue
    SongIdsFirstIndex: any /* Int64 */,
    // Indicates where to start playing the queued songs, since in the game you can choose whether
    // you want to start from the first, second or third song
    PlayStartAt: number,
    // Last song index played
    PlayCurrentAt: any /* Int64 */,
    // Last state of PlayCurrentAt
    PlayLastAt: any /* Int64 */,
    // Whether the player is casting the buffs based on their player Action id.
    IsCastingBuffs: boolean,
    // Whether the player is double casting songs.
    IsDoubleCasting: boolean,
    // Whether the song cast was interrupted by either a monster hitting the player
    IsCastingInterrupted: boolean,
};

declare type LanceType = {
    SafijiivaMaxHits: number,
    Type: ClassesType,
    IsMelee: boolean,
    SafijiivaRegenCounter: number,
    IsWeaponSheated: boolean,
    Sharpness: number,
    MaximumSharpness: number,
    SharpnessLevel: SharpnessLevelType,
    MaxSharpnessLevel: SharpnessLevelType,
    Sharpnesses: ClrArray<number>,
    SharpnessMax: number,
    SharpnessMin: number,
    Dispatch(e: any /* delegate */): void,
    Dispatch(e: any /* delegate */): void,
    OnSafijiivaCounterUpdate: EventObj<JobEventArgsType>,
    OnWeaponSheathStateChange: EventObj<JobEventArgsType>,
    OnSharpnessChange: EventObj<SharpnessEventArgsType>,
    OnSharpnessLevelChange: EventObj<SharpnessEventArgsType>,
};

declare type GunLanceType = {
    SafijiivaMaxHits: number,
    Type: ClassesType,
    IsMelee: boolean,
    TotalAmmo: number,
    Ammo: number,
    TotalBigAmmo: number,
    BigAmmo: number,
    WyvernsFireTimer: number,
    WyvernstakeBlastTimer: number,
    WyvernstakeMax: number,
    WyvernstakeNextMax: number,
    HasWyvernstakeLoaded: boolean,
    SafijiivaRegenCounter: number,
    IsWeaponSheated: boolean,
    Sharpness: number,
    MaximumSharpness: number,
    SharpnessLevel: SharpnessLevelType,
    MaxSharpnessLevel: SharpnessLevelType,
    Sharpnesses: ClrArray<number>,
    SharpnessMax: number,
    SharpnessMin: number,
    Dispatch(e: any /* delegate */): void,
    Dispatch(e: any /* delegate */): void,
    Dispatch(e: any /* delegate */): void,
    OnTotalAmmoChange: EventObj<GunLanceEventArgsType>,
    OnAmmoChange: EventObj<GunLanceEventArgsType>,
    OnTotalBigAmmoChange: EventObj<GunLanceEventArgsType>,
    OnBigAmmoChange: EventObj<GunLanceEventArgsType>,
    OnWyvernsFireTimerUpdate: EventObj<GunLanceEventArgsType>,
    OnWyvernstakeBlastTimerUpdate: EventObj<GunLanceEventArgsType>,
    OnWyvernstakeStateChanged: EventObj<GunLanceEventArgsType>,
    OnSafijiivaCounterUpdate: EventObj<JobEventArgsType>,
    OnWeaponSheathStateChange: EventObj<JobEventArgsType>,
    OnSharpnessChange: EventObj<SharpnessEventArgsType>,
    OnSharpnessLevelChange: EventObj<SharpnessEventArgsType>,
};

declare type GunLanceEventArgsType = {
    TotalAmmo: number,
    Ammo: number,
    TotalBigAmmo: number,
    BigAmmo: number,
    WyvernsFireTimer: number,
    WyvernstakeBlastTimer: number,
    WyvernstakeMax: number,
    WyvernstakeNextMax: number,
    HasWyvernstakeLoaded: boolean,
};

declare type SwitchAxeType = {
    SafijiivaMaxHits: number,
    Type: ClassesType,
    IsMelee: boolean,
    OuterGauge: number,
    SwordChargeTimer: number,
    SwordChargeMaxTimer: number,
    InnerGauge: number,
    SwitchAxeBuffTimer: number,
    SwitchAxeBuffMaxTimer: number,
    IsBuffActive: boolean,
    SafijiivaRegenCounter: number,
    IsWeaponSheated: boolean,
    Sharpness: number,
    MaximumSharpness: number,
    SharpnessLevel: SharpnessLevelType,
    MaxSharpnessLevel: SharpnessLevelType,
    Sharpnesses: ClrArray<number>,
    SharpnessMax: number,
    SharpnessMin: number,
    Dispatch(e: any /* delegate */): void,
    Dispatch(e: any /* delegate */): void,
    OnOuterGaugeChange: EventObj<SwitchAxeEventArgsType>,
    OnInnerGaugeChange: EventObj<SwitchAxeEventArgsType>,
    OnSwitchAxeBuffTimerUpdate: EventObj<SwitchAxeEventArgsType>,
    OnSwitchAxeBuffStateChange: EventObj<SwitchAxeEventArgsType>,
    OnSafijiivaCounterUpdate: EventObj<JobEventArgsType>,
    OnWeaponSheathStateChange: EventObj<JobEventArgsType>,
    OnSharpnessChange: EventObj<SharpnessEventArgsType>,
    OnSharpnessLevelChange: EventObj<SharpnessEventArgsType>,
};

declare type SwitchAxeEventArgsType = {
    OuterGauge: number,
    SwordChargeTimer: number,
    SwordChargeMaxTimer: number,
    InnerGauge: number,
    SwitchAxeBuffTimer: number,
    SwitchAxeBuffMaxTimer: number,
    IsBuffActive: boolean,
};

declare type ChargeBladeType = {
    Type: ClassesType,
    IsMelee: boolean,
    VialChargeGauge: number,
    ShieldBuffTimer: number,
    SwordBuffTimer: number,
    Vials: number,
    PoweraxeTimer: number,
    SafijiivaMaxHits: number,
    SafijiivaRegenCounter: number,
    IsWeaponSheated: boolean,
    Sharpness: number,
    MaximumSharpness: number,
    SharpnessLevel: SharpnessLevelType,
    MaxSharpnessLevel: SharpnessLevelType,
    Sharpnesses: ClrArray<number>,
    SharpnessMax: number,
    SharpnessMin: number,
    Dispatch(e: any /* delegate */): void,
    Dispatch(e: any /* delegate */): void,
    OnVialChargeGaugeChange: EventObj<ChargeBladeEventArgsType>,
    OnShieldBuffChange: EventObj<ChargeBladeEventArgsType>,
    OnSwordBuffChange: EventObj<ChargeBladeEventArgsType>,
    OnVialsChange: EventObj<ChargeBladeEventArgsType>,
    OnPoweraxeBuffChange: EventObj<ChargeBladeEventArgsType>,
    OnSafijiivaCounterUpdate: EventObj<JobEventArgsType>,
    OnWeaponSheathStateChange: EventObj<JobEventArgsType>,
    OnSharpnessChange: EventObj<SharpnessEventArgsType>,
    OnSharpnessLevelChange: EventObj<SharpnessEventArgsType>,
};

declare type ChargeBladeEventArgsType = {
    VialChargeGauge: number,
    ShieldBuffTimer: number,
    SwordBuffTimer: number,
    PoweraxeTimer: number,
    Vials: number,
};

declare type InsectGlaiveType = {
    SafijiivaMaxHits: number,
    Type: ClassesType,
    IsMelee: boolean,
    RedBuff: number,
    WhiteBuff: number,
    OrangeBuff: number,
    KinsectStamina: number,
    RedKinsectTimer: number,
    YellowKinsectTimer: number,
    KinsectChargeType: KinsectChargeBuffType,
    BuffQueueSize: number,
    FirstBuffQueued: number,
    SecondBuffQueued: number,
    SafijiivaRegenCounter: number,
    IsWeaponSheated: boolean,
    Sharpness: number,
    MaximumSharpness: number,
    SharpnessLevel: SharpnessLevelType,
    MaxSharpnessLevel: SharpnessLevelType,
    Sharpnesses: ClrArray<number>,
    SharpnessMax: number,
    SharpnessMin: number,
    Dispatch(e: any /* delegate */): void,
    Dispatch(e: any /* delegate */): void,
    OnRedBuffUpdate: EventObj<InsectGlaiveEventArgsType>,
    OnWhiteBuffUpdate: EventObj<InsectGlaiveEventArgsType>,
    OnOrangeBuffUpdate: EventObj<InsectGlaiveEventArgsType>,
    OnKinsectStaminaUpdate: EventObj<InsectGlaiveEventArgsType>,
    OnKinsectChargeBuffUpdate: EventObj<InsectGlaiveEventArgsType>,
    OnKinsectChargeBuffChange: EventObj<InsectGlaiveEventArgsType>,
    BuffQueueChanged: EventObj<InsectGlaiveEventArgsType>,
    OnSafijiivaCounterUpdate: EventObj<JobEventArgsType>,
    OnWeaponSheathStateChange: EventObj<JobEventArgsType>,
    OnSharpnessChange: EventObj<SharpnessEventArgsType>,
    OnSharpnessLevelChange: EventObj<SharpnessEventArgsType>,
};

declare type KinsectChargeBuffType = Enum<"None" | "Yellow" | "Red" | "Both">;

declare type InsectGlaiveEventArgsType = {
    RedBuff: number,
    WhiteBuff: number,
    OrangeBuff: number,
    KinsectStamina: number,
    RedKinsectTimer: number,
    YellowKinsectTimer: number,
    KinsectChargeType: KinsectChargeBuffType,
    BuffQueueSize: number,
    FirstBuffQueued: number,
    SecondBuffQueued: number,
};

declare type BowType = {
    SafijiivaMaxHits: number,
    Type: ClassesType,
    IsMelee: boolean,
    ChargeProgress: number,
    ChargeLevel: number,
    MaxChargeLevel: number,
    SafijiivaRegenCounter: number,
    IsWeaponSheated: boolean,
    Sharpness: number,
    MaximumSharpness: number,
    SharpnessLevel: SharpnessLevelType,
    MaxSharpnessLevel: SharpnessLevelType,
    Sharpnesses: ClrArray<number>,
    SharpnessMax: number,
    SharpnessMin: number,
    Dispatch(e: any /* delegate */): void,
    Dispatch(e: any /* delegate */): void,
    OnChargeLevelChange: EventObj<BowEventArgsType>,
    OnChargeProgressUpdate: EventObj<BowEventArgsType>,
    OnChargeLevelMaxUpdate: EventObj<BowEventArgsType>,
    OnSafijiivaCounterUpdate: EventObj<JobEventArgsType>,
    OnWeaponSheathStateChange: EventObj<JobEventArgsType>,
    OnSharpnessChange: EventObj<SharpnessEventArgsType>,
    OnSharpnessLevelChange: EventObj<SharpnessEventArgsType>,
};

declare type BowEventArgsType = {
    ChargeProgress: number,
    ChargeLevel: number,
    MaxChargeLevel: number,
};

declare type LightBowgunType = {
    SafijiivaMaxHits: number,
    Type: ClassesType,
    IsMelee: boolean,
    Ammos: IReadOnlyCollection<sAmmoType>,
    GroundAmmo: number,
    SpecialAmmoRegen: number,
    Ammo: number,
    EquippedAmmo: sEquippedAmmoType,
    SafijiivaRegenCounter: number,
    IsWeaponSheated: boolean,
    Sharpness: number,
    MaximumSharpness: number,
    SharpnessLevel: SharpnessLevelType,
    MaxSharpnessLevel: SharpnessLevelType,
    Sharpnesses: ClrArray<number>,
    SharpnessMax: number,
    SharpnessMin: number,
    Dispatch(e: any /* delegate */): void,
    Dispatch(e: any /* delegate */): void,
    OnSpecialAmmoRegenUpdate: EventObj<LightBowgunEventArgsType>,
    OnGroundAmmoCountChange: EventObj<LightBowgunEventArgsType>,
    OnEquippedAmmoChange: EventObj<LightBowgunEventArgsType>,
    OnAmmoCountChange: EventObj<LightBowgunEventArgsType>,
    OnSafijiivaCounterUpdate: EventObj<JobEventArgsType>,
    OnWeaponSheathStateChange: EventObj<JobEventArgsType>,
    OnSharpnessChange: EventObj<SharpnessEventArgsType>,
    OnSharpnessLevelChange: EventObj<SharpnessEventArgsType>,
};

declare type sAmmoType = {
    unk0: any /* Int64 */,
    Ammo: number,
    Total: number,
    Maximum: number,
    unk1: number,
};

declare type sEquippedAmmoType = {
    unk0: any /* Int64 */,
    index: number,
    index2: number,
    ammoToShoot: number,
    ammoInBarrel: number,
    unk1: number,
    ItemId: number,
};

declare type LightBowgunEventArgsType = {
    SpecialAmmoRegen: number,
    GroundAmmo: number,
    Ammo: number,
    EquippedAmmo: sEquippedAmmoType,
    Ammos: IReadOnlyCollection<sAmmoType>,
};

declare type HeavyBowgunType = {
    SafijiivaMaxHits: number,
    Type: ClassesType,
    IsMelee: boolean,
    Ammos: IReadOnlyCollection<sAmmoType>,
    ScopeZoomMultiplier: number,
    HasScopeEquipped: boolean,
    WyvernsnipeTimer: number,
    WyvernheartTimer: number,
    IsTimer: boolean,
    EquippedAmmo: sEquippedAmmoType,
    Ammo: number,
    FocusMultiplier: number,
    SpecialAmmoType: HBGSpecialTypeType,
    SafijiivaRegenCounter: number,
    IsWeaponSheated: boolean,
    Sharpness: number,
    MaximumSharpness: number,
    SharpnessLevel: SharpnessLevelType,
    MaxSharpnessLevel: SharpnessLevelType,
    Sharpnesses: ClrArray<number>,
    SharpnessMax: number,
    SharpnessMin: number,
    Dispatch(e: any /* delegate */): void,
    Dispatch(e: any /* delegate */): void,
    OnWyvernsnipeUpdate: EventObj<HeavyBowgunEventArgsType>,
    OnWyvernheartUpdate: EventObj<HeavyBowgunEventArgsType>,
    OnEquippedAmmoChange: EventObj<HeavyBowgunEventArgsType>,
    OnAmmoCountChange: EventObj<HeavyBowgunEventArgsType>,
    OnScopeMultiplierChange: EventObj<HeavyBowgunEventArgsType>,
    OnScopeStateChange: EventObj<HeavyBowgunEventArgsType>,
    OnSafijiivaCounterUpdate: EventObj<JobEventArgsType>,
    OnWeaponSheathStateChange: EventObj<JobEventArgsType>,
    OnSharpnessChange: EventObj<SharpnessEventArgsType>,
    OnSharpnessLevelChange: EventObj<SharpnessEventArgsType>,
};

declare type HBGSpecialTypeType = Enum<"None" | "Wyvernheart" | "Wyvernsniper">;

declare type HeavyBowgunEventArgsType = {
    SpecialAmmoType: HBGSpecialTypeType,
    WyvernsnipeTimer: number,
    WyvernheartTimer: number,
    WyvernsnipeMaxTimer: number,
    WyvernheartMaxAmmo: number,
    IsTimer: boolean,
    HasScopeEquipped: boolean,
    ScopeZoomMultiplier: number,
    EquippedAmmo: sEquippedAmmoType,
    Ammo: number,
    Ammos: IReadOnlyCollection<sAmmoType>,
};

declare type GearType = {
    Weapon: WeaponType,
    Helmet: ArmorType,
    Chest: ArmorType,
    Hands: ArmorType,
    Waist: ArmorType,
    Legs: ArmorType,
    Charm: CharmType,
    SpecializedTools: ClrArray<SpecializedToolType>,
};

declare type WeaponType = {
    Type: number,
    ID: number,
    Decorations: ClrArray<DecorationType>,
    Augments: ClrArray<AugmentType>,
    NewAugments: ClrArray<NewAugmentType>,
    Awakenings: ClrArray<AwakenedSkillType>,
    CustomAugments: ClrArray<CustomAugmentType>,
    BowgunMods: ClrArray<BowgunModType>,
};

declare type DecorationType = {
    ID: number,
};

declare type AugmentType = {
    ID: number,
};

declare type NewAugmentType = {
    ID: number,
    Level: number,
};

declare type AwakenedSkillType = {
    ID: number,
};

declare type CustomAugmentType = {
    ID: number,
    Level: number,
};

declare type BowgunModType = {
    ID: number,
};

declare type ArmorType = {
    ID: number,
    Decorations: ClrArray<DecorationType>,
};

declare type CharmType = {
    ID: number,
};

declare type SpecializedToolType = {
    ID: number,
    Decorations: ClrArray<DecorationType>,
};

declare type sGearType = {
    AbsoluteSlot: number,
    Slot: number,
    Category: number,
    unk3: number,
    Type: number,
    Id: number,
    Level: number,
    ExperienceRemaining: number,
    DecorationSlot1: number,
    DecorationSlot2: number,
    DecorationSlot3: number,
    unk11: number,
    unk12: number,
    unk13: number,
    unk14: number,
    unk15: number,
    AugmentId: number,
};

declare type MonsterType = {
    MonsterAddress: any /* Int64 */,
    // Number of this monster
    MonsterNumber: number,
    // Monster name
    Name: string,
    // Monster EM Id
    Id: string,
    // Monster in-game Id
    GameId: number,
    // Monster size multiplier
    SizeMultiplier: number,
    // Monster size crown name
    Crown: string,
    // Monster maximum health
    MaxHealth: number,
    // Monster current health
    Health: number,
    // Monster weaknesses
    Weaknesses: Dictionary<string, number>,
    // Normalized health percentage (Health / MaxHealth)
    HPPercentage: number,
    // Whether this monster is the current target
    IsTarget: boolean,
    // Whether this monster is selected
    IsSelect: number,
    // Whether this monster is alive
    IsAlive: boolean,
    // Same as IsAlive but is only set to true after everything is initialized
    IsActuallyAlive: boolean,
    // Current enrage timer
    EnrageTimer: number,
    // Enrage maximum duration
    EnrageTimerStatic: number,
    // Whether this monster is enraged
    IsEnraged: boolean,
    // Current monster stamina
    Stamina: number,
    // Maximum monster stamina
    MaxStamina: number,
    // Monster threshold to be captured
    CaptureThreshold: number,
    // Whether this monster is captured
    IsCaptured: boolean,
    // Current action Id
    ActionId: number,
    // Filtered stringified action name
    ActionName: string,
    // Raw stringified action name
    ActionReferenceName: string,
    // Current Alatreon element, used only by Alatreon
    AlatreonElement: AlatreonStateType,
    // Whether the local player is currently the party host
    IsLocalHost: boolean,
    // Current monster model data
    ModelData: sMonsterModelDataType,
    AliveMonsters: ClrArray<boolean>,
    // Current monster parts
    Parts: List<PartType>,
    // Current monster ailments
    Ailments: List<AilmentType>,
    // Current monster position
    Position: Vector3Type,
    // Dispatched when a monster spawns
    OnMonsterSpawn: EventObj<MonsterSpawnEventArgsType>,
    // Dispatched when all monster ailments are loaded
    OnMonsterAilmentsCreate: EventObj<EventArgs>,
    // Dispatched when a monster despawns (either leaves area or after it's dead/captured body despawns)
    OnMonsterDespawn: EventObj<EventArgs>,
    // Dispatched when a monster is killed
    OnMonsterDeath: EventObj<EventArgs>,
    // Dispatched when a monster is captured
    OnMonsterCapture: EventObj<EventArgs>,
    // Dispatched when a monster is targeted by the local player
    OnTargetted: EventObj<EventArgs>,
    // Dispatched when the monster crown size is changed
    OnCrownChange: EventObj<EventArgs>,
    // Dispatched when the monster health value changes
    OnHPUpdate: EventObj<MonsterUpdateEventArgsType>,
    // Dispatched when the monster stamina value changes
    OnStaminaUpdate: EventObj<MonsterUpdateEventArgsType>,
    // Dispatched when a monster executes a new action
    OnActionChange: EventObj<MonsterUpdateEventArgsType>,
    // Dispatched when a monster becomes enraged
    OnEnrage: EventObj<MonsterUpdateEventArgsType>,
    // Dispatched when a monster becomes unenraged
    OnUnenrage: EventObj<MonsterUpdateEventArgsType>,
    // Dispatched when the monster enrage timer is updated
    OnEnrageTimerUpdate: EventObj<MonsterUpdateEventArgsType>,
    // Dispatched when the monster scan is finished
    OnMonsterScanFinished: EventObj<EventArgs>,
    // Dispatched when Alatreon shifts to another element 
    // Used only by Alatreon.
    OnAlatreonElementShift: EventObj<EventArgs>,
};

declare type AlatreonStateType = Enum<"None" | "Fire" | "Ice" | "Dragon">;

declare type sMonsterModelDataType = {
    pos: sVector3Type,
    unk0: number,
    unk1: number,
    unk2: number,
    verticalAngle: number,
    w: number,
    scale: sVector3Type,
};

declare type PartType = {
    cMonsterPartData: sMonsterPartDataType,
    cTenderizedPart: sTenderizedPartType,
    Owner: MonsterType,
    Address: any /* Int64 */,
    Name: string,
    BreakThresholds: ClrArray<ThresholdInfoType>,
    HasBreakConditions: boolean,
    BrokenCounter: number,
    Health: number,
    TotalHealth: number,
    IsRemovable: boolean,
    Group: string,
    TenderizedIds: ClrArray<number>,
    TenderizeDuration: number,
    TenderizeMaxDuration: number,
    SetPartInfo(data: sMonsterPartDataType, IsPartyHost: boolean): void,
    SetTenderizeInfo(data: sTenderizedPartType): void,
    Destroy(): void,
    OnHealthChange: EventObj<MonsterPartEventArgsType>,
    OnBrokenCounterChange: EventObj<MonsterPartEventArgsType>,
    OnTenderizeStateChange: EventObj<MonsterPartEventArgsType>,
};

declare type sMonsterPartDataType = {
    address: any /* Int64 */,
    unk0: number,
    MaxHealth: number,
    Health: number,
    unk1: number,
    Counter: number,
    unk2: number,
    ExtraMaxHealth: number,
    ExtraHealth: number,
    unk3: number,
    unk4: number,
    unk5: number,
    unk6: number,
    unk7: number,
    unk8: number,
};

declare type sTenderizedPartType = {
    Address: any /* Int64 */,
    Duration: number,
    MaxDuration: number,
    unk0: number,
    unk1: number,
    unk2: any /* Int64 */,
    ExtraDuration: number,
    MaxExtraDuration: number,
    unk3: number,
    unk4: number,
    PartId: number,
    TenderizedCounter: number,
    unk6: number,
    unk7: number,
};

declare type ThresholdInfoType = {
    Threshold: number,
    HasConditions: boolean,
    MinHealth: number,
    MinFlinch: number,
};

declare type MonsterPartEventArgsType = {
    // The monster who has this part
    Owner: MonsterType,
    // Part current health
    Health: number,
    // Part maximum health
    TotalHealth: number,
    // Whether this part has a special condition to be met before breaking
    HasBreakConditions: boolean,
    // Part broken counter, increments whenever Health reaches 0
    BrokenCounter: number,
    // Part tenderize duration
    Duration: number,
    // Part tenderize maximum duration
    MaxDuration: number,
};

declare type AilmentType = {
    cMonsterAilment: sMonsterAilmentType,
    Address: any /* Int64 */,
    Name: string,
    Group: string,
    Id: number,
    Buildup: number,
    MaxBuildup: number,
    Duration: number,
    MaxDuration: number,
    Counter: number,
    Type: AilmentTypeType,
    SetAilmentInfo(AilmentData: sMonsterAilmentType, IsPartyHost: boolean, uId: number): void,
    Destroy(): void,
    OnBuildupChange: EventObj<MonsterAilmentEventArgsType>,
    OnDurationChange: EventObj<MonsterAilmentEventArgsType>,
    OnCounterChange: EventObj<MonsterAilmentEventArgsType>,
};

declare type sMonsterAilmentType = {
    Source: any /* Int64 */,
    IsActive: number,
    unk1: number,
    Id: number,
    MaxDuration: number,
    unk3: number,
    unk4: number,
    unk5: number,
    unk6: number,
    unk7: number,
    unk8: number,
    Buildup: number,
    unk10: number,
    unk11: number,
    unk12: number,
    MaxBuildup: number,
    unk13: number,
    unk14: number,
    unk15: number,
    unk16: number,
    unk17: number,
    unk18: number,
    unk19: number,
    unk20: number,
    unk21: number,
    unk22: number,
    unk23: number,
    Duration: number,
    unk25: number,
    Counter: number,
    unk27: number,
    unk28: number,
    unk29: number,
    unk30: sUnk0MonsterAilmentType,
};

declare type sUnk0MonsterAilmentType = {
    address: any /* Int64 */,
    unk0: number,
    unk1: number,
    unk2: number,
    unk3: number,
    unk4: number,
    unk5: number,
    unk6: number,
    unk7: number,
    unk8: number,
    unk9: number,
};

declare type AilmentTypeType = Enum<"Ailment" | "Status">;

declare type MonsterAilmentEventArgsType = {
    // Ailment name
    Name: string,
    // Ailment duration
    Duration: number,
    // Ailment maximum duration
    MaxDuration: number,
    // Ailment buildup
    Buildup: number,
    // Ailment max buildup
    MaxBuildup: number,
    // Ailment counter of how many times this ailment has activated
    Counter: number,
};

declare type StatsServiceType = {
    SaveMonsters(monsters: IEnumerable<MonsterType>): void,
    FormatMonsterData(m: MonsterType): string,
};

declare type AddressType = {
    Addresses: ReadOnlyDictionary<string, any /* Int64 */>,
    Offsets: ReadOnlyDictionary<string, ClrArray<number>>,
    GAME_VERSION: number,
    PREICEBORNE_VERSION: number,
    CooldownFixed: any /* Int64 */,
    CooldownDynamic: any /* Int64 */,
    TimerFixed: any /* Int64 */,
    TimerDynamic: any /* Int64 */,
    // Adds a static address to the Addresses dictionary
    AddAddress(name: string, address: any /* Int64 */): boolean,
    // Adds a offsets array to the Offsets dictionary
    AddOffsets(name: string, offsetsArr: ClrArray<number>): boolean,
    // Gets a relative address from the Addresses map
    GetAddress(name: string): any /* Int64 */,
    // Gets an absoute address (BASE + Relative) from the Addresses map
    GetAbsoluteAddress(name: string): any /* Int64 */,
    // Gets an array of offsets from the Offsets map
    GetOffsets(name: string): ClrArray<number>,
    LoadMemoryMap(version: number): boolean,
};

declare type ConfigType = {
    BotToken: string,
    Chats: ClrArray<any /* Int64 */>,
    Widget: WidgetPositionType,
    SaveStats: boolean,
    SkipByDefault: boolean,
    Logs: LogsConfigType,
    EmitResultingScript: boolean,
    UseInjectedInputs: boolean,
    EnabledByDefault: boolean,
    ToggleKey: string,
    ReloadKey: string,
};

declare type WidgetPositionType = {
    X: number,
    Y: number,
    Scale: number,
    Width: number,
};

declare type LogsConfigType = {
    MaxEntries: number,
    EntryTimeoutMs: number,
    UpdateTimeoutMs: number,
};

declare type CommunicatorType = {
    Trace(msg: string): Promise<void>,
    Start(): Promise<void>,
    Stop(): Promise<void>,
    NotifyChat(chat: any /* Int64 */, status: string, counter: any /* Int64 */): void,
    CrownAsk(status: string, counter: any /* Int64 */): Promise<boolean>,
};

declare type MonsterInfoType = {
    Em: string,
    Id: number,
    Crowns: CrownInfoType,
    Capture: number,
    Weaknesses: ClrArray<WeaknessInfoType>,
    MaxParts: number,
    Parts: ClrArray<PartInfoType>,
    MaxRemovableParts: number,
    GetCrownByMultiplier(multiplier: number): string,
};

declare type CrownInfoType = {
    Mini: number,
    Silver: number,
    Gold: number,
};

declare type WeaknessInfoType = {
    Id: string,
    Stars: number,
};

declare type PartInfoType = {
    Id: string,
    IsRemovable: boolean,
    GroupId: string,
    BreakThresholds: ClrArray<ThresholdInfoType>,
    Skip: boolean,
    Index: number,
    TenderizeIds: ClrArray<number>,
};

declare type ExtendedHostFunctionsType = {
    // Imports a host type by name.
    type(name: string, hostTypeArgs: ClrArray<any /* Object */>): any /* Object */,
    // Imports a host type by name from the specified assembly.
    type(name: string, assemblyName: string, hostTypeArgs: ClrArray<any /* Object */>): any /* Object */,
    // Imports the host type for the specified Type.
    type(type: any /* Type */): any /* Object */,
    arrType(rank: number): any /* Object */,
    // Imports types from one or more host assemblies.
    lib(assemblyNames: ClrArray<string>): HostTypeCollectionType,
    // Imports types from one or more host assemblies and merges them with an existing host type collection.
    lib(collection: HostTypeCollectionType, assemblyNames: ClrArray<string>): HostTypeCollectionType,
    // Imports a COM/ActiveX type.
    comType(progID: string, serverName: string): any /* Object */,
    // Creates a COM/ActiveX object of the specified type.
    newComObj(progID: string, serverName: string): any /* Object */,
    typeLibEnums(obj: any /* generic: T */, collection: HostTypeCollectionType): HostTypeCollectionType,
    // Creates an empty host object.
    newObj(): PropertyBagType,
    newObj(args: ClrArray<any /* Object */>): any /* generic: T */,
    // Creates a host object of the specified type. This version is invoked if the specified
    // type cannot be used as a type argument.
    newObj(type: any /* Object */, args: ClrArray<any /* Object */>): any /* Object */,
    // Performs dynamic instantiation.
    newObj(target: any /* IDynamicMetaObjectProvider */, args: ClrArray<any /* Object */>): any /* Object */,
    // Creates a host array with Object as the element type.
    newArr(lengths: ClrArray<number>): any /* Object */,
    // Creates a host array with Object as the element type.
    newArr(lengths: ClrArray<number>): any /* Object */,
    newVar(initValue: any /* generic: T */): any /* Object */,
    del(scriptFunc: any /* Object */): any /* generic: T */,
    // Creates a delegate that invokes a script function and returns no value.
    proc(argCount: number, scriptFunc: any /* Object */): any /* Object */,
    // Creates a delegate that invokes a script function and returns its result value.
    func(argCount: number, scriptFunc: any /* Object */): any /* Object */,
    // Creates a delegate that invokes a script function and returns its result value.
    func(argCount: number, scriptFunc: any /* Object */): any /* Object */,
    typeOf(): any /* Type */,
    // Gets the Type for the specified host type. This version is invoked
    // if the specified object cannot be used as a type argument.
    typeOf(value: any /* Object */): any /* Type */,
    isType(value: any /* Object */): boolean,
    asType(value: any /* Object */): any /* Object */,
    cast(value: any /* Object */): any /* Object */,
    // Determines whether an object is a host type. This version is invoked if the specified
    // object cannot be used as a type argument.
    isTypeObj(value: any /* Object */): boolean,
    isTypeObj(): boolean,
    // Determines whether the specified value is null.
    isNull(value: any /* Object */): boolean,
    flags(args: ClrArray<any /* generic: T */>): any /* generic: T */,
    // Converts the specified value to a strongly typed SByte instance.
    toSByte(value: any /* IConvertible */): any /* Object */,
    // Converts the specified value to a strongly typed Byte instance.
    toByte(value: any /* IConvertible */): any /* Object */,
    // Converts the specified value to a strongly typed Int16 instance.
    toInt16(value: any /* IConvertible */): any /* Object */,
    // Converts the specified value to a strongly typed UInt16 instance.
    toUInt16(value: any /* IConvertible */): any /* Object */,
    // Converts the specified value to a strongly typed Char instance.
    toChar(value: any /* IConvertible */): any /* Object */,
    // Converts the specified value to a strongly typed Int32 instance.
    toInt32(value: any /* IConvertible */): any /* Object */,
    // Converts the specified value to a strongly typed UInt32 instance.
    toUInt32(value: any /* IConvertible */): any /* Object */,
    // Converts the specified value to a strongly typed Int64 instance.
    toInt64(value: any /* IConvertible */): any /* Object */,
    // Converts the specified value to a strongly typed UInt64 instance.
    toUInt64(value: any /* IConvertible */): any /* Object */,
    // Converts the specified value to a strongly typed Single instance.
    toSingle(value: any /* IConvertible */): any /* Object */,
    // Converts the specified value to a strongly typed Double instance.
    toDouble(value: any /* IConvertible */): any /* Object */,
    // Converts the specified value to a strongly typed Decimal instance.
    toDecimal(value: any /* IConvertible */): any /* Object */,
    // Gets the value of a property in a dynamic host object that implements IPropertyBag.
    getProperty(target: IPropertyBagType, name: string): any /* Object */,
    // Sets a property value in a dynamic host object that implements IPropertyBag.
    setProperty(target: IPropertyBagType, name: string, value: any /* Object */): any /* Object */,
    // Removes a property from a dynamic host object that implements IPropertyBag.
    removeProperty(target: IPropertyBagType, name: string): boolean,
    // Gets the value of a property in a dynamic host object that implements IDynamicMetaObjectProvider.
    getProperty(target: any /* IDynamicMetaObjectProvider */, name: string): any /* Object */,
    // Sets a property value in a dynamic host object that implements IDynamicMetaObjectProvider.
    setProperty(target: any /* IDynamicMetaObjectProvider */, name: string, value: any /* Object */): any /* Object */,
    // Removes a property from a dynamic host object that implements IDynamicMetaObjectProvider.
    removeProperty(target: any /* IDynamicMetaObjectProvider */, name: string): boolean,
    // Gets the value of an element in a dynamic host object that implements IDynamicMetaObjectProvider.
    getElement(target: any /* IDynamicMetaObjectProvider */, indices: ClrArray<any /* Object */>): any /* Object */,
    // Sets an element value in a dynamic host object that implements IDynamicMetaObjectProvider.
    setElement(target: any /* IDynamicMetaObjectProvider */, value: any /* Object */, indices: ClrArray<any /* Object */>): any /* Object */,
    // Removes an element from a dynamic host object that implements IDynamicMetaObjectProvider.
    removeElement(target: any /* IDynamicMetaObjectProvider */, indices: ClrArray<any /* Object */>): boolean,
    // Casts a dynamic host object to its static type.
    toStaticType(value: any /* IDynamicMetaObjectProvider */): any /* Object */,
    // Allows script code to handle host exceptions.
    tryCatch(tryFunc: any /* Object */, catchFunc: any /* Object */, finallyFunc: any /* Object */): boolean,
};

declare type HostTypeCollectionType = {
    Item: any /* Object */,
    // Gets a collection of property names from the PropertyBag.
    Keys: IEnumerable<string>,
    // Gets a collection of property values from the PropertyBag.
    Values: IEnumerable<any /* Object */>,
    // Adds types from an assembly to a host type collection.
    AddAssembly(assembly: any /* Assembly */): void,
    // Adds types from an assembly to a host type collection. The assembly is specified by name.
    AddAssembly(assemblyName: string): void,
    // Adds selected types from an assembly to a host type collection.
    AddAssembly(assembly: any /* Assembly */, filter: any /* Predicate`1 */): void,
    // Adds selected types from an assembly to a host type collection. The assembly is
    // specified by name.
    AddAssembly(assemblyName: string, filter: any /* Predicate`1 */): void,
    // Adds a type to a host type collection.
    AddType(type: any /* Type */): void,
    // Adds a type to a host type collection. The type is specified by name.
    AddType(typeName: string, typeArgs: ClrArray<any /* Type */>): void,
    // Adds a type to a host type collection. The type is specified by type name and assembly name.
    AddType(typeName: string, assemblyName: string, typeArgs: ClrArray<any /* Type */>): void,
    // Locates a namespace within a host type collection.
    GetNamespaceNode(name: string): PropertyBagType,
    // Sets a property value without checking whether the PropertyBag is read-only.
    SetPropertyNoCheck(name: string, value: any /* Object */): void,
    // Removes a property without checking whether the PropertyBag is read-only.
    RemovePropertyNoCheck(name: string): boolean,
    // Removes all properties without checking whether the PropertyBag is read-only.
    ClearNoCheck(): void,
    // Determines whether the PropertyBag contains a property with the specified name.
    ContainsKey(key: string): boolean,
    // Adds a property to the PropertyBag.
    Add(key: string, value: any /* Object */): void,
    // Removes a property from the PropertyBag.
    Remove(key: string): boolean,
    TryGetValue(key: string, value: any /* Object& */): boolean,
    // Occurs when a property is added or replaced, or when the collection is cleared.
    PropertyChanged: EventObj<any /* PropertyChangedEventArgs */>,
};

declare type PropertyBagType = {
    Item: any /* Object */,
    // Gets a collection of property names from the PropertyBag.
    Keys: IEnumerable<string>,
    // Gets a collection of property values from the PropertyBag.
    Values: IEnumerable<any /* Object */>,
    // Sets a property value without checking whether the PropertyBag is read-only.
    SetPropertyNoCheck(name: string, value: any /* Object */): void,
    // Removes a property without checking whether the PropertyBag is read-only.
    RemovePropertyNoCheck(name: string): boolean,
    // Removes all properties without checking whether the PropertyBag is read-only.
    ClearNoCheck(): void,
    // Determines whether the PropertyBag contains a property with the specified name.
    ContainsKey(key: string): boolean,
    // Adds a property to the PropertyBag.
    Add(key: string, value: any /* Object */): void,
    // Removes a property from the PropertyBag.
    Remove(key: string): boolean,
    TryGetValue(key: string, value: any /* Object& */): boolean,
    // Occurs when a property is added or replaced, or when the collection is cleared.
    PropertyChanged: EventObj<any /* PropertyChangedEventArgs */>,
};

declare type IPropertyBagType = any /* Microsoft.ClearScript.IPropertyBag */;


// --- Events ---
declare type Events = {
    'Game.OnWorldTimeUpdate': WorldEventArgsType,
    'Game.OnWorldDayTimeUpdate': WorldEventArgsType,
    'Game.OnClockChange': EventArgs,
    'Game.Player.OnLevelChange': EventArgs,
    'Game.Player.OnWeaponChange': EventArgs,
    'Game.Player.OnSessionChange': EventArgs,
    'Game.Player.OnClassChange': EventArgs,
    'Game.Player.OnActionChange': EventArgs,
    'Game.Player.OnCharacterLogin': EventArgs,
    'Game.Player.OnCharacterLogout': EventArgs,
    'Game.Player.OnZoneChange': EventArgs,
    'Game.Player.OnPeaceZoneEnter': EventArgs,
    'Game.Player.OnVillageEnter': EventArgs,
    'Game.Player.OnPeaceZoneLeave': EventArgs,
    'Game.Player.OnVillageLeave': EventArgs,
    'Game.Player.OnHotDrinkStateChange': EventArgs,
    'Game.Player.OnAilmentUpdate': PlayerAilmentEventArgsType,
    'Game.Player.OnPlayerScanFinished': EventArgs,
    'Game.Player.CurrentWeapon.OnSafijiivaCounterUpdate': JobEventArgsType,
    'Game.Player.CurrentWeapon.OnWeaponSheathStateChange': JobEventArgsType,
    'Game.Player.CurrentWeapon.OnSharpnessChange': SharpnessEventArgsType,
    'Game.Player.CurrentWeapon.OnSharpnessLevelChange': SharpnessEventArgsType,
    'Game.Player.LastWeapon.OnSafijiivaCounterUpdate': JobEventArgsType,
    'Game.Player.LastWeapon.OnWeaponSheathStateChange': JobEventArgsType,
    'Game.Player.LastWeapon.OnSharpnessChange': SharpnessEventArgsType,
    'Game.Player.LastWeapon.OnSharpnessLevelChange': SharpnessEventArgsType,
    'Game.FirstMonster.OnMonsterSpawn': MonsterSpawnEventArgsType,
    'Game.FirstMonster.OnMonsterAilmentsCreate': EventArgs,
    'Game.FirstMonster.OnMonsterDespawn': EventArgs,
    'Game.FirstMonster.OnMonsterDeath': EventArgs,
    'Game.FirstMonster.OnMonsterCapture': EventArgs,
    'Game.FirstMonster.OnTargetted': EventArgs,
    'Game.FirstMonster.OnCrownChange': EventArgs,
    'Game.FirstMonster.OnHPUpdate': MonsterUpdateEventArgsType,
    'Game.FirstMonster.OnStaminaUpdate': MonsterUpdateEventArgsType,
    'Game.FirstMonster.OnActionChange': MonsterUpdateEventArgsType,
    'Game.FirstMonster.OnEnrage': MonsterUpdateEventArgsType,
    'Game.FirstMonster.OnUnenrage': MonsterUpdateEventArgsType,
    'Game.FirstMonster.OnEnrageTimerUpdate': MonsterUpdateEventArgsType,
    'Game.FirstMonster.OnMonsterScanFinished': EventArgs,
    'Game.FirstMonster.OnAlatreonElementShift': EventArgs,
    'Game.SecondMonster.OnMonsterSpawn': MonsterSpawnEventArgsType,
    'Game.SecondMonster.OnMonsterAilmentsCreate': EventArgs,
    'Game.SecondMonster.OnMonsterDespawn': EventArgs,
    'Game.SecondMonster.OnMonsterDeath': EventArgs,
    'Game.SecondMonster.OnMonsterCapture': EventArgs,
    'Game.SecondMonster.OnTargetted': EventArgs,
    'Game.SecondMonster.OnCrownChange': EventArgs,
    'Game.SecondMonster.OnHPUpdate': MonsterUpdateEventArgsType,
    'Game.SecondMonster.OnStaminaUpdate': MonsterUpdateEventArgsType,
    'Game.SecondMonster.OnActionChange': MonsterUpdateEventArgsType,
    'Game.SecondMonster.OnEnrage': MonsterUpdateEventArgsType,
    'Game.SecondMonster.OnUnenrage': MonsterUpdateEventArgsType,
    'Game.SecondMonster.OnEnrageTimerUpdate': MonsterUpdateEventArgsType,
    'Game.SecondMonster.OnMonsterScanFinished': EventArgs,
    'Game.SecondMonster.OnAlatreonElementShift': EventArgs,
    'Game.ThirdMonster.OnMonsterSpawn': MonsterSpawnEventArgsType,
    'Game.ThirdMonster.OnMonsterAilmentsCreate': EventArgs,
    'Game.ThirdMonster.OnMonsterDespawn': EventArgs,
    'Game.ThirdMonster.OnMonsterDeath': EventArgs,
    'Game.ThirdMonster.OnMonsterCapture': EventArgs,
    'Game.ThirdMonster.OnTargetted': EventArgs,
    'Game.ThirdMonster.OnCrownChange': EventArgs,
    'Game.ThirdMonster.OnHPUpdate': MonsterUpdateEventArgsType,
    'Game.ThirdMonster.OnStaminaUpdate': MonsterUpdateEventArgsType,
    'Game.ThirdMonster.OnActionChange': MonsterUpdateEventArgsType,
    'Game.ThirdMonster.OnEnrage': MonsterUpdateEventArgsType,
    'Game.ThirdMonster.OnUnenrage': MonsterUpdateEventArgsType,
    'Game.ThirdMonster.OnEnrageTimerUpdate': MonsterUpdateEventArgsType,
    'Game.ThirdMonster.OnMonsterScanFinished': EventArgs,
    'Game.ThirdMonster.OnAlatreonElementShift': EventArgs,
    'Game.HuntedMonster.OnMonsterSpawn': MonsterSpawnEventArgsType,
    'Game.HuntedMonster.OnMonsterAilmentsCreate': EventArgs,
    'Game.HuntedMonster.OnMonsterDespawn': EventArgs,
    'Game.HuntedMonster.OnMonsterDeath': EventArgs,
    'Game.HuntedMonster.OnMonsterCapture': EventArgs,
    'Game.HuntedMonster.OnTargetted': EventArgs,
    'Game.HuntedMonster.OnCrownChange': EventArgs,
    'Game.HuntedMonster.OnHPUpdate': MonsterUpdateEventArgsType,
    'Game.HuntedMonster.OnStaminaUpdate': MonsterUpdateEventArgsType,
    'Game.HuntedMonster.OnActionChange': MonsterUpdateEventArgsType,
    'Game.HuntedMonster.OnEnrage': MonsterUpdateEventArgsType,
    'Game.HuntedMonster.OnUnenrage': MonsterUpdateEventArgsType,
    'Game.HuntedMonster.OnEnrageTimerUpdate': MonsterUpdateEventArgsType,
    'Game.HuntedMonster.OnMonsterScanFinished': EventArgs,
    'Game.HuntedMonster.OnAlatreonElementShift': EventArgs,
    'Player.OnLevelChange': EventArgs,
    'Player.OnWeaponChange': EventArgs,
    'Player.OnSessionChange': EventArgs,
    'Player.OnClassChange': EventArgs,
    'Player.OnActionChange': EventArgs,
    'Player.OnCharacterLogin': EventArgs,
    'Player.OnCharacterLogout': EventArgs,
    'Player.OnZoneChange': EventArgs,
    'Player.OnPeaceZoneEnter': EventArgs,
    'Player.OnVillageEnter': EventArgs,
    'Player.OnPeaceZoneLeave': EventArgs,
    'Player.OnVillageLeave': EventArgs,
    'Player.OnHotDrinkStateChange': EventArgs,
    'Player.OnAilmentUpdate': PlayerAilmentEventArgsType,
    'Player.OnPlayerScanFinished': EventArgs,
    'Player.CurrentWeapon.OnSafijiivaCounterUpdate': JobEventArgsType,
    'Player.CurrentWeapon.OnWeaponSheathStateChange': JobEventArgsType,
    'Player.CurrentWeapon.OnSharpnessChange': SharpnessEventArgsType,
    'Player.CurrentWeapon.OnSharpnessLevelChange': SharpnessEventArgsType,
    'Player.LastWeapon.OnSafijiivaCounterUpdate': JobEventArgsType,
    'Player.LastWeapon.OnWeaponSheathStateChange': JobEventArgsType,
    'Player.LastWeapon.OnSharpnessChange': SharpnessEventArgsType,
    'Player.LastWeapon.OnSharpnessLevelChange': SharpnessEventArgsType,
};

// ---- Host objects ---
declare const Game: GameType;
declare const Player: PlayerType;
declare const Address: AddressType;
declare const StatsService: StatsServiceType;
declare const Config: ConfigType;
declare const Communicator: CommunicatorType;
declare const MonstersInfo: ReadOnlyDictionary<number, MonsterInfoType>;
declare const host: ExtendedHostFunctionsType;

