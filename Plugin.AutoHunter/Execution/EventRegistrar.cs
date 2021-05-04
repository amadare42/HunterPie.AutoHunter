using Engine.Js.AddIns;
using HunterPie.Core;
using Pather.CSharp;

namespace Plugin.AutoHunter.Execution
{
    public class EventRegistrar : IEventRegistrar
    {
        public Game Game { get; set; }
        public bool EnableRaisingEvents { get; set; } = true;
        

        public EventRegistrar(Game game)
        {
            this.Game = game;
            this.PathResolver = new Resolver();
        }

        public Resolver PathResolver { get; set; }

        public (string subPath, object rootObj) ResolvePrefixes(string eventKey)
        {
            if (eventKey.StartsWith("Game."))
                return (eventKey.Substring("Game.".Length), this.Game);
            
            if (eventKey.StartsWith("Player."))
                return (eventKey.Substring("Player.".Length), this.Game.Player);

            return (eventKey, this.Game);
        }

        public object GetEventContainer(string eventKey)
        {
            if (string.IsNullOrEmpty(eventKey))
            {
                return null;
            }
            
            if (!eventKey.Contains("."))
                return this.Game;

            var (subPath, rootObj) = ResolvePrefixes(eventKey);

            // Foo.Bar.EventName -> Foo.Bar
            if (subPath.Contains("."))
                return this.PathResolver.ResolveSafe(rootObj, subPath.Substring(0, eventKey.LastIndexOf(".")));

            return rootObj;
        }
    }
}